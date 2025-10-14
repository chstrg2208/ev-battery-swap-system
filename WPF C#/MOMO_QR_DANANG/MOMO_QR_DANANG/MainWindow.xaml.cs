using System.Windows;
using System.Windows.Input;
using System.Text.RegularExpressions;

namespace MOMO_QR_DANANG
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        // Đảm bảo chỉ nhập số cho trường Số Tiền
        private void NumberValidationTextBox(object sender, TextCompositionEventArgs e)
        {
            Regex regex = new Regex("[^0-9]+");
            e.Handled = regex.IsMatch(e.Text);
        }
    }
}