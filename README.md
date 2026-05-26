# SAP09_FE - Hướng dẫn deploy lên SAP BTP

Đây là một ứng dụng SAPUI5 frontend tĩnh. App hiện chạy trực tiếp từ `index.html` và tải SAPUI5 từ CDN, nên bạn có thể deploy theo kiểu static web app lên SAP BTP Cloud Foundry mà không cần backend.

## Bộ file đã thêm

- `package.json`: script chạy local bằng `serve`.
- `manifest.yml`: cấu hình push app lên Cloud Foundry.
- `Staticfile`: bật `pushstate` để refresh/deep link không bị lỗi.
- `.cfignore`: loại trừ các thư mục không cần thiết khi deploy.

## Yêu cầu trước khi deploy

1. Cài Node.js 18 hoặc mới hơn.
2. Cài Cloud Foundry CLI.
3. Đăng nhập vào SAP BTP subaccount có Cloud Foundry environment.
4. Nếu chưa có, tạo Cloud Foundry org và space trong subaccount.

## Chạy local

1. Mở terminal tại thư mục dự án.
2. Cài dependency:

```bash
npm install
```

3. Chạy app local:

```bash
npm start
```

4. Mở trình duyệt tại `http://localhost:8080`.

## Deploy lên SAP BTP Cloud Foundry

### Bước 1: Đăng nhập CF

```bash
cf login -a https://api.cf.<region>.hana.ondemand.com
```

Thay `<region>` bằng region của subaccount, ví dụ `eu10`, `ap21`, `us10`.

### Bước 2: Chọn org và space

```bash
cf target -o <org-name> -s <space-name>
```

### Bước 3: Push app

```bash
cf push -f manifest.yml
```

### Bước 4: Lấy URL ứng dụng

```bash
cf apps
```

Mở URL của app `sap09-fe` trong trình duyệt.

## Cách hoạt động của app trên BTP

- `index.html` vẫn bootstrap SAPUI5 từ `https://ui5.sap.com`.
- Ứng dụng chỉ cần host tĩnh, nên Cloud Foundry staticfile buildpack là đủ.
- `Staticfile` với `pushstate: enabled` giúp các route nội bộ của UI5 không bị lỗi khi refresh.

## Nếu bạn muốn deploy theo chuẩn HTML5 Apps Repo / Launchpad

Luồng hiện tại là cách nhanh nhất để chạy app trên BTP. Nếu bạn cần:

- hiển thị trong SAP Build Work Zone hoặc Fiori Launchpad,
- tách runtime/app router rõ hơn,
- hoặc gắn destination/backend OData thật,

thì nên chuyển sang mô hình `mta.yaml` + HTML5 App Repository + Approuter. Tôi có thể tạo tiếp bộ file đó cho bạn.

## Troubleshooting

### App mở trắng hoặc lỗi route khi refresh

- Kiểm tra file `Staticfile` có `pushstate: enabled`.
- Đảm bảo deploy bằng `cf push -f manifest.yml` từ thư mục gốc dự án.

### Không tải được UI5

- Kiểm tra máy có truy cập được `https://ui5.sap.com`.
- Nếu môi trường hạn chế mạng ngoài, cần bundle UI5 theo cách khác.

### Lỗi thiếu dependency khi chạy local

- Chạy lại `npm install`.
- Kiểm tra Node.js >= 18.