// Driver Vehicle Management - Main Container (Refactored)
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import userService from '../../assets/js/services/userService';
import contractService from '../../assets/js/services/contractService';
import VehicleList from './Vehicles/VehicleList';
import EmptyVehicles from './Vehicles/EmptyVehicles';
import AddVehicleModal from './Vehicles/AddVehicleModal';
import VehicleDetailModal from './Vehicles/VehicleDetailModal';

const DriverVehicles = () => {
  const { currentUser } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [formData, setFormData] = useState({
    plateNumber: '',
    vehicleModel: '',
    vinNumber: '',
    batteryType: 'LiFePO4-60kWh'
  });

  // Fetch contracts for vehicles
  const fetchContracts = async (userId) => {
    try {
      const contractsResponse = await contractService.getContracts(userId);
      console.log('📝 Contract service response:', contractsResponse);
      
      if (contractsResponse.success && contractsResponse.data?.length > 0) {
        const contractsList = contractsResponse.data.map(contractData => ({
          id: contractData.contractId || contractData.id || contractData.contractNumber,
          contractNumber: contractData.contractNumber,
          planName: contractData.planName || contractData.plan || `Contract ${contractData.contractNumber}`,
          status: contractData.status || 'active',
          startDate: contractData.startDate,
          endDate: contractData.endDate,
          monthlyFee: contractData.monthlyFee || contractData.monthlyBaseFee,
          monthlyTotalFee: contractData.monthlyTotalFee,
          monthlyDistance: contractData.monthlyDistance || contractData.distance,
          vehiclePlate: contractData.vehiclePlate || contractData.vehicleLicensePlate,
          vehicleId: contractData.vehicleId || contractData.vehicle_id
        }));
        
        setContracts(contractsList);
        console.log('✅ Loaded contracts:', contractsList);
      } else {
        setContracts([]);
      }
    } catch (err) {
      console.warn('⚠️ Failed to fetch contracts:', err);
      setContracts([]);
    }
  };

  const getVehicleContract = (vehicle) => {
    console.log('🔍 Finding contract for vehicle:', {
      vehicleId: vehicle.id,
      plateNumber: vehicle.plateNumber,
      availableContracts: contracts
    });
    
    const foundContract = contracts.find(contract => {
      // Match by ID (if both exist)
      const matchById = vehicle.id && contract.vehicleId && 
                       (contract.vehicleId === vehicle.id || 
                        contract.vehicleId === parseInt(vehicle.id));
      
      // Match by plate number (normalize: remove spaces, dots, hyphens)
      const normalizePlate = (plate) => {
        if (!plate) return '';
        return plate.toString().replace(/[\s.-]/g, '').toUpperCase();
      };
      
      const vehiclePlateNorm = normalizePlate(vehicle.plateNumber);
      const contractPlateNorm = normalizePlate(contract.vehiclePlate);
      const matchByPlate = vehiclePlateNorm && contractPlateNorm && 
                          vehiclePlateNorm === contractPlateNorm;
      
      console.log('  Checking contract:', {
        contractId: contract.id,
        contractNumber: contract.contractNumber,
        contractVehicleId: contract.vehicleId,
        contractPlate: contract.vehiclePlate,
        contractPlateNorm,
        vehiclePlateNorm,
        matchById,
        matchByPlate,
        matched: matchById || matchByPlate
      });
      
      return matchById || matchByPlate;
    });
    
    console.log(foundContract ? '✅ Found contract:' : '❌ No contract found:', foundContract);
    return foundContract;
  };

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚗 Fetching vehicles for user:', currentUser?.email);
      
      if (!currentUser) {
        setVehicles([]);
        return;
      }
      
      const userId = currentUser.id || currentUser.user_id || currentUser.userId;
      if (!userId) {
        setVehicles([]);
        return;
      }

      const response = await userService.getUserById(userId);
      console.log('📡 API Response:', response);
      
      let vehiclesList = [];
      
      if (response.success) {
        if (response.vehicles) {
          vehiclesList = response.vehicles;
        } else if (response.data && response.data.vehicles) {
          vehiclesList = response.data.vehicles;
        }
        
        // Ensure each vehicle has an ID field (use vehicleId if available)
        vehiclesList = vehiclesList.map((vehicle, index) => ({
          ...vehicle,
          id: vehicle.id || vehicle.vehicleId || vehicle.vehicle_id || (index + 1)
        }));
        
        console.log('🚗 Found vehicles:', vehiclesList);
        
        // Check if there's an updated vehicle in sessionStorage (after battery swap)
        const updatedVehicleStr = sessionStorage.getItem('selectedVehicle');
        if (updatedVehicleStr) {
          try {
            const updatedVehicle = JSON.parse(updatedVehicleStr);
            console.log('🔄 Found updated vehicle in session:', updatedVehicle);
            
            // Update the battery level in the vehicles list
            vehiclesList = vehiclesList.map(vehicle => {
              if (vehicle.id === updatedVehicle.id || 
                  vehicle.plateNumber === updatedVehicle.plateNumber) {
                console.log('✅ Updating vehicle battery:', vehicle.plateNumber, 
                           'from', vehicle.batteryLevel, 'to', updatedVehicle.batteryLevel);
                return {
                  ...vehicle,
                  batteryLevel: updatedVehicle.batteryLevel || updatedVehicle.health,
                  health: updatedVehicle.batteryLevel || updatedVehicle.health
                };
              }
              return vehicle;
            });
          } catch (err) {
            console.warn('⚠️ Failed to parse updated vehicle from session:', err);
          }
        }
        
        setVehicles(vehiclesList || []);
        
        // Fetch contracts for vehicles
        await fetchContracts(userId);
      } else {
        console.log('❌ API failed');
        setVehicles([]);
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setError('Lỗi khi tải danh sách xe: ' + err.message);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const userId = currentUser.id || currentUser.user_id || currentUser.userId;
      
      const vehicleData = {
        plateNumber: formData.plateNumber,
        vehicleModel: formData.vehicleModel,
        vinNumber: formData.vinNumber,
        batteryType: formData.batteryType,
        userId: userId
      };
      
      console.log('📝 Adding vehicle:', vehicleData);
      
      // TODO: Call API when backend endpoint is ready
      alert(`Đã gửi yêu cầu thêm xe ${formData.vehicleModel} - ${formData.plateNumber}\nVui lòng liên hệ admin để xử lý.`);
      
      setShowAddModal(false);
      setFormData({
        plateNumber: '',
        vehicleModel: '',
        vinNumber: '',
        batteryType: 'LiFePO4-60kWh'
      });
      
      fetchVehicles();
      
    } catch (err) {
      console.error('❌ Error adding vehicle:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDetailModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setFormData({
      plateNumber: '',
      vehicleModel: '',
      vinNumber: '',
      batteryType: 'LiFePO4-60kWh'
    });
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedVehicle(null);
  };

  if (loading) {
    return (
      <DashboardLayout role="driver">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ color: '#19c37d', fontSize: '1.5rem' }}>⏳ Đang tải...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="driver">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ color: '#ff6b6b', fontSize: '1.2rem', marginBottom: '15px' }}>
            ❌ {error}
          </div>
          <button onClick={fetchVehicles} style={{
            padding: '10px 20px',
            background: '#19c37d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            🔄 Thử lại
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="driver">
      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '30px' 
        }}>
          <div>
            <h1 style={{ color: '#FFFFFF', margin: '0 0 10px 0' }}>🚗 Quản lý phương tiện</h1>
            <p style={{ color: '#B0B0B0', margin: 0 }}>Danh sách xe của bạn ({vehicles.length} xe)</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #19c37d, #15a36a)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(25, 195, 125, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ➕ Thêm phương tiện
          </button>
        </div>

        {/* Vehicle List or Empty State */}
        {vehicles.length > 0 ? (
          <VehicleList 
            vehicles={vehicles} 
            onViewDetails={handleViewDetails} 
          />
        ) : (
          <EmptyVehicles 
            onAddVehicle={() => setShowAddModal(true)} 
          />
        )}

        {/* Modals */}
        <AddVehicleModal
          show={showAddModal}
          onClose={handleCloseAddModal}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAddVehicle}
          loading={loading}
        />

        <VehicleDetailModal
          show={showDetailModal}
          vehicle={selectedVehicle}
          vehicleContract={selectedVehicle ? getVehicleContract(selectedVehicle) : null}
          onClose={handleCloseDetailModal}
        />
      </div>
    </DashboardLayout>
  );
};

export default DriverVehicles;
