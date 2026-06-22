# SAP09_FE - Deploy chuẩn SAP BTP

Ứng dụng này là SAPUI5 frontend, nhưng để đi đúng hướng BTP thì nên có một lớp `approuter` + `xsuaa` ở phía trước. Cách này cho phép:

- redirect đăng nhập chuẩn SAP BTP,
- bảo vệ app bằng authentication/authorization,
- sẵn đường để đưa vào Launchpad / Work Zone sau này,
- giữ nguyên code UI5 hiện tại, không phải viết lại app.

## Cấu trúc deploy hiện tại

- `approuter/`: runtime Node.js để serve app và xử lý redirect auth.
- `xs-security.json`: khai báo app scopes / role templates cho `xsuaa`.
- `mta.yaml`: cấu hình build và deploy chuẩn Cloud Foundry.
- `scripts/prepare-approuter.mjs`: copy asset UI5 hiện tại sang `approuter/resources` trước khi build.

## Chạy local

```bash
npm install
npm start
```

Mở `http://localhost:8080`.

Nếu muốn kiểm tra approuter cục bộ:

```bash
npm run install:approuter
npm run prepare:approuter
npm run start:approuter
```

## Deploy chuẩn BTP

### 1. Cài công cụ cần thiết

```bash
npm install -g mbt
```

Bạn cũng cần Cloud Foundry CLI đã đăng nhập vào subaccount có Cloud Foundry environment.

### 2. Cài dependency

```bash
npm install
npm run install:approuter
```

### 3. Chuẩn bị tài nguyên cho approuter

```bash
npm run prepare:approuter
```

Lệnh này copy toàn bộ asset UI5 cần thiết vào `approuter/resources` để approuter có thể serve app.

### 4. Build MTA

```bash
mbt build
```

### 5. Deploy lên Cloud Foundry

```bash
cf login -a https://api.cf.<region>.hana.ondemand.com
cf target -o <org-name> -s <space-name>
cf deploy mta_archives/sap09-fe_1.0.0.mtar
```

Sau khi deploy xong, mở route của approuter. Truy cập lần đầu sẽ được chuyển sang màn hình login của XSUAA, đăng nhập xong sẽ quay lại app.

## Luồng auth/redirect

1. Người dùng mở URL app trên BTP.
2. `approuter` kiểm tra request.
3. Nếu chưa có token hợp lệ, `approuter` redirect sang `xsuaa`.
4. Người dùng đăng nhập thành công.
5. `xsuaa` trả về token, `approuter` nhận token và trả app về trình duyệt.

## Nếu bạn cần Launchpad / Work Zone

Phần còn thiếu tiếp theo là đăng ký app vào content provider của Launchpad và tạo tile/target mapping. Bộ khung hiện tại đã đúng hướng để đi tiếp bước đó.

## Troubleshooting

### 404 khi refresh

- Chạy lại `npm run prepare:approuter` trước khi build.
- Kiểm tra `approuter/xs-app.json` có `welcomeFile` và `localDir` đúng.

### Không vào được login

- Kiểm tra `xsuaa` đã được tạo cùng `mta`.
- Đảm bảo user của bạn đã được gán role collection phù hợp trong BTP cockpit.

### Không tìm thấy `mbt`

- Cài lại bằng `npm install -g mbt`.
- Mở terminal mới rồi chạy lại `mbt build`.