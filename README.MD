Tên đề tài : Ứng dụng đọc truyện ngắn

Giới thiệu:
**Quản lý xác thực thông minh (Authentication Flow):** Bảo mật hệ thống bằng cách chia tách cây điều hướng độc lập dựa trên trạng thái đăng nhập. Khi người dùng đăng xuất, toàn bộ dữ liệu truyện cũ sẽ lập tức bị xóa sạch khỏi bộ nhớ RAM, ngăn chặn hoàn toàn việc quay lại màn hình cũ bằng nút Back vật lý.
* **Bộ tùy chỉnh Font chữ nâng cao (Font Customizer Aa):** Cho phép độc giả chủ động thay đổi kích thước chữ to/nhỏ kèm cơ chế tự động co giãn khoảng cách dòng (`lineHeight`). Hệ thống tự động nhận diện hệ điều hành (Platform API) để áp dụng cấu hình font mượt mà (`Georgia` trên iOS và `serif` trên Android) chống lỗi vỡ giao diện.
* **Bộ lọc kép song song (Hybrid Search Matrix):** Thanh tìm kiếm tối ưu cho phép kết hợp lọc thời gian thực giữa từ khóa tự do (Tên truyện/Tác giả) và bảng chọn danh mục 16 thể loại truyện khác nhau có khả năng thu gọn/mở rộng linh hoạt.
* **Tối ưu hóa bộ nhớ điều hướng (`navigation.replace`):** Cơ chế chuyển chương truyện bằng cách thay thế màn hình cũ thay vì xếp chồng (Stack Push), giúp thiết bị luôn giải phóng RAM sạch sẽ dù độc giả có đọc liên tiếp hàng trăm chương truyện.
* **Lưu lịch sử đọc tự động (Background Auto-Tracking):** Sử dụng các hiệu ứng vòng đời ngầm để ghi nhận tiến độ đọc truyện của người dùng vào Context trung tâm ngay khi họ tương tác mà không cần thao tác thủ công.
Danh sách thành viên : 
- Đinh Quang Tùng - Msv: 23810310337
- Vũ Minh Đạt - Msv: 23810310341
- Nguyễn Bá Đông - Msv: 23810310335
Công nghệ sử dụng :
- React Native
- JavaScript
- React Context API
- React Navigation
- Platform API
- Git
Hướng dẫn cài đặt
Yêu cầu máy tính đã cài đặt sẵn **Node.js (LTS)**.
1. **Cloning dự án từ Github về máy:**

   ```bash
   git clone [https://github.com/tungdinh123-hihi/App_Truyen]
   cd my-story-app
2. **Cài đặt các thư viện phụ thuộc**
    npm install
Hướng dẫn chạy project
1. Tại thư mục dự án chạy lệnh:
npx expo start
2. Xem ứng dụng
Cách 1 (Trên điện thoại thật ): * Tải ứng dụng Expo Go trên App Store (iOS) hoặc CH Play (Android).

Mở camera điện thoại quét mã QR Code hiển thị trên màn hình Terminal máy tính (Yêu cầu điện thoại và máy tính kết nối chung một mạng Wi-Fi).
Cách 2 (Trên trình duyệt Web): Bấm phím w tại Terminal máy tính để mở giao diện Web di động.
Cách 3 (Trên máy ảo): Bấm phím a cho máy ảo Android hoặc phím i cho máy ảo iPhone.

Tài khoản Demo:
- Gmail: tung@Gmail.com
- Mật khẩu : 123456
