using MOMO_QR_DANANG.Services;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.ComponentModel;
using System.Drawing.Imaging;
using System.Runtime.CompilerServices;
using System.Windows.Input;
using System.Windows.Media.Imaging;
// Bạn có thể giữ hoặc xóa cả hai dòng using dưới đây, vì ta đã chỉ định rõ trong code
// using Microsoft.Win32; 
// using System.Windows.Forms;

namespace MOMO_QR_DANANG.ViewModels
{
    // --- BASE VIEWMODEL ---
    public class BaseViewModel : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler? PropertyChanged;

        protected void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
    // --- END BASE VIEWMODEL ---


    public class MainViewModel : BaseViewModel
    {
        // ... (Các thuộc tính khác không thay đổi) ...
        private string _soTaiKhoan = "000123456789";
        public string SoTaiKhoan
        {
            get => _soTaiKhoan;
            set { _soTaiKhoan = value; OnPropertyChanged(); ((RelayCommand)GenerateQRCommand).RaiseCanExecuteChanged(); }
        }

        private string _soTien = "50000";
        public string SoTien
        {
            get => _soTien;
            set { _soTien = value; OnPropertyChanged(); ((RelayCommand)GenerateQRCommand).RaiseCanExecuteChanged(); }
        }

        private string _noiDung = "Thanh toan don hang";
        public string NoiDung
        {
            get => _noiDung;
            set { _noiDung = value; OnPropertyChanged(); }
        }

        private string _tenTaiKhoan = "NGUYEN VAN A";
        public string TenTaiKhoan
        {
            get => _tenTaiKhoan;
            set { _tenTaiKhoan = value; OnPropertyChanged(); ((RelayCommand)GenerateQRCommand).RaiseCanExecuteChanged(); }
        }

        private BitmapImage? _logoImage;
        public BitmapImage? LogoImage
        {
            get => _logoImage;
            set { _logoImage = value; OnPropertyChanged(); }
        }

        private BitmapImage? _qrCodeImage;
        public BitmapImage? QRCodeImage
        {
            get => _qrCodeImage;
            set { _qrCodeImage = value; OnPropertyChanged(); }
        }

        public ICommand SelectLogoCommand { get; }
        public ICommand GenerateQRCommand { get; }

        public MainViewModel()
        {
            SelectLogoCommand = new RelayCommand(SelectLogo);
            GenerateQRCommand = new RelayCommand(GenerateQR, CanGenerateQR);
        }

        private void SelectLogo(object? parameter)
        {
            // SỬA DỨT ĐIỂM: Gọi đầy đủ tên để tránh nhầm lẫn
            Microsoft.Win32.OpenFileDialog openFileDialog = new Microsoft.Win32.OpenFileDialog
            {
                Filter = "Image files (*.png)|*.png;",
                Title = "Chọn ảnh Logo",
                CheckFileExists = true
            };

            if (openFileDialog.ShowDialog() == true)
            {
                LogoImage = new BitmapImage(new Uri(openFileDialog.FileName));
            }
        }

        // ... (Các phương thức khác không thay đổi) ...
        private bool CanGenerateQR(object? parameter)
        {
            return !string.IsNullOrWhiteSpace(SoTaiKhoan) &&
                   int.TryParse(SoTien, out int soTienInt) && soTienInt > 0 &&
                   !string.IsNullOrWhiteSpace(TenTaiKhoan);
        }

        private async void GenerateQR(object? parameter)
        {
            if (!int.TryParse(SoTien, out int soTienInt)) return;

            string logoBase64 = "";
            if (LogoImage != null)
            {
                var drawingImage = APIRequestHelper.ImageSourceToDrawingImage(LogoImage);
                if (drawingImage != null)
                {
                    logoBase64 = APIRequestHelper.ImageToBase64(drawingImage, ImageFormat.Png);
                }
            }

            var apiRequest = new APIRequest
            {
                acqId = 970436,
                accountNo = SoTaiKhoan.Trim(),
                accountName = TenTaiKhoan.Trim(),
                amount = soTienInt,
                logo = logoBase64,
                addInfo = NoiDung.Trim(),
                template = "compact2"
            };

            var jsonRequest = JsonConvert.SerializeObject(apiRequest);

            var client = new RestClient("https://api.vietqr.io/v2/generate");
            var request = new RestRequest();
            request.Method = Method.Post;
            request.AddHeader("Accept", "application/json");
            request.AddParameter("application/json", jsonRequest, ParameterType.RequestBody);

            try
            {
                var response = await client.ExecuteAsync(request);

                if (response.Content == null)
                {
                    System.Windows.MessageBox.Show("Không nhận được phản hồi từ máy chủ.", "Lỗi API", System.Windows.MessageBoxButton.OK, System.Windows.MessageBoxImage.Error);
                    return;
                }

                var dataResult = JsonConvert.DeserializeObject<ApiResponse>(response.Content);

                if (dataResult != null && dataResult.data != null && !string.IsNullOrEmpty(dataResult.data.qrDataURL))
                {
                    var base64Pure = dataResult.data.qrDataURL.Replace("data:image/png;base64,", "");
                    QRCodeImage = APIRequestHelper.Base64ToBitmapImage(base64Pure);
                }
                else
                {
                    System.Windows.MessageBox.Show($"Không thể tạo mã QR. Lỗi: {dataResult?.desc}", "Lỗi API", System.Windows.MessageBoxButton.OK, System.Windows.MessageBoxImage.Warning);
                }
            }
            catch (Exception ex)
            {
                System.Windows.MessageBox.Show($"Lỗi kết nối hoặc xử lý: {ex.Message}", "Lỗi", System.Windows.MessageBoxButton.OK, System.Windows.MessageBoxImage.Error);
            }
        }
    }

    // --- RELAY COMMAND CLASS ---
    public class RelayCommand : ICommand
    {
        private readonly Action<object?> _execute;
        private readonly Func<object?, bool>? _canExecute;

        public event EventHandler? CanExecuteChanged
        {
            add { CommandManager.RequerySuggested += value; }
            remove { CommandManager.RequerySuggested -= value; }
        }

        public RelayCommand(Action<object?> execute, Func<object?, bool>? canExecute = null)
        {
            _execute = execute ?? throw new ArgumentNullException(nameof(execute));
            _canExecute = canExecute;
        }

        public bool CanExecute(object? parameter) => _canExecute == null || _canExecute(parameter);

        public void Execute(object? parameter) => _execute(parameter);

        public void RaiseCanExecuteChanged()
        {
            CommandManager.InvalidateRequerySuggested();
        }
    }
}