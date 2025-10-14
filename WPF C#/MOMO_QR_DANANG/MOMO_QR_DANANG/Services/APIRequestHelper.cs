using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Windows.Media;
using System.Windows.Media.Imaging;

namespace MOMO_QR_DANANG.Services
{
    public static class APIRequestHelper
    {
        // Chuyển đổi System.Drawing.Image sang Base64
        public static string ImageToBase64(Image image, ImageFormat format)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                image.Save(ms, format);
                byte[] imageBytes = ms.ToArray();
                string base64String = Convert.ToBase64String(imageBytes);

                string mimeType = GetMimeType(format);
                return $"data:{mimeType};base64,{base64String}";
            }
        }

        private static string GetMimeType(ImageFormat format)
        {
            if (format.Equals(ImageFormat.Png)) return "image/png";
            if (format.Equals(ImageFormat.Jpeg)) return "image/jpeg";
            return "image/png";
        }

        // SỬA: Thêm '?' vì phương thức này có thể trả về null trong khối catch
        public static BitmapImage? Base64ToBitmapImage(string base64String)
        {
            try
            {
                byte[] imageBytes = Convert.FromBase64String(base64String);
                using (var ms = new MemoryStream(imageBytes))
                {
                    var image = new BitmapImage();
                    image.BeginInit();
                    image.CacheOption = BitmapCacheOption.OnLoad;
                    image.StreamSource = ms;
                    image.EndInit();
                    image.Freeze();
                    return image;
                }
            }
            catch
            {
                return null;
            }
        }

        // SỬA: Thêm '?' vì phương thức này có thể trả về null
        public static Image? ImageSourceToDrawingImage(ImageSource? imageSource)
        {
            if (imageSource is BitmapImage bitmapImage)
            {
                var encoder = new PngBitmapEncoder();
                encoder.Frames.Add(BitmapFrame.Create(bitmapImage));

                using (var stream = new MemoryStream())
                {
                    encoder.Save(stream);
                    return Image.FromStream(stream);
                }
            }
            return null;
        }
    }

    // --- DATA MODELS ---

    public class APIRequest
    {
        // SỬA: Khởi tạo giá trị mặc định để tránh lỗi non-nullable
        public string accountNo { get; set; } = string.Empty;
        public string accountName { get; set; } = string.Empty;
        public int acqId { get; set; }
        public int amount { get; set; }
        public string addInfo { get; set; } = string.Empty;
        public string logo { get; set; } = string.Empty;
        public string format { get; set; } = string.Empty;
        public string template { get; set; } = string.Empty;
        public string theme { get; set; } = string.Empty;
    }

    public class Data
    {
        public int acpId { get; set; }
        // SỬA: Khởi tạo giá trị mặc định
        public string accountName { get; set; } = string.Empty;
        public string qrCode { get; set; } = string.Empty;
        public string qrDataURL { get; set; } = string.Empty;
    }

    public class ApiResponse
    {
        // SỬA: Khởi tạo giá trị mặc định
        public string code { get; set; } = string.Empty;
        public string desc { get; set; } = string.Empty;
        // SỬA: Thêm '?' vì 'data' có thể là null nếu API trả về lỗi
        public Data? data { get; set; }
    }
}