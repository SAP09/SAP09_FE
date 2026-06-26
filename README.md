# SAP09_FE - Deploy trực tiếp không dùng Approuter

Ứng dụng này hiện đang được cấu hình để chạy trực tiếp từ `webapp/` và kết nối tới backend SAP bằng Basic Auth.

## Điều kiện cần

- `webapp/model/Config.js` phải dùng URL backend trực tiếp.
- Nếu bạn deploy lên server nội bộ, server đó cần phục vụ các file tĩnh từ `dist/`.
- Nếu backend không nằm cùng nguồn gốc với app, bạn phải cấu hình CORS cho SAP hoặc dùng reverse proxy trên server.

## Chạy local

```bash
npm install
npm start
```

Mở browser tại `http://localhost:8080` hoặc URL được in ra.

## Build tĩnh

```bash
npm run build
```

Kết quả sẽ nằm trong thư mục `dist/`.

## Deploy lên server trường (BSP/ABAP Repository)

1. Build app:

```bash
npm run build
```

2. Dùng transaction `/UI5/UI5_REPOSITORY_LOAD` hoặc SE80 để import nội dung `dist/` vào BSP application/public area.

3. Tạo BSP application mới hoặc dùng application hiện có trong ABAP Repository.

4. Chọn transport request và deploy toàn bộ file `dist/`.

5. Run app từ URL ABAP như:

```
https://<sap-host>/sap/bc/ui5_ui5/sap/<application_name>/index.html
```

## Cấu hình backend cùng origin

Khi app chạy trên cùng server SAP, không cần CORS hoặc proxy.

Mở `webapp/model/Config.js` và đảm bảo:

- `BACKEND_ENABLED: true`
- `BACKEND_URL: "/sap/opu/odata4/sap/zsb_gsugp9/srvd_a2x/sap/zsr_registry/0001/"`
- `AUTH_TYPE: "basic-per-user"`

Trong trường hợp backend và app cùng host, URI tương đối `/sap/opu/odata4/...` sẽ hoạt động đúng.

## Lưu ý cho BSP/ABAP

- Nếu dùng namespace BSP, tên app nên bắt đầu bằng `Z` hoặc `Y`.
- `index.html` và `manifest.json` phải nằm trong root của BSP app.
- App gọi backend trực tiếp bằng `Basic Auth` qua `SAPLoginService`.

## Những file đã bỏ

- `webapp/approuter/`
- `webapp/mta.yaml`
- `webapp/xs-security.json`
- `webapp/manifest.yml`
- `webapp/scripts/prepare-approuter.mjs`

## Lưu ý

- App vẫn dùng login Basic Auth trong frontend nếu `AUTH_TYPE` là `basic-per-user`.
- `manifest.json` hiện tại chỉ dùng cho metadata và cấu hình app; luồng auth đã trở thành frontend-based.
