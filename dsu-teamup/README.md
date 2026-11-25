# DSU TeamUp AI

대회 맞춤 추천 및 양방향 팀 매칭 플랫폼 — DSU AI Challenge 2026, Track A (team NEXTMATE).

> 시연용 버전입니다. 모든 학생·팀·대회 정보는 **가상 데이터**입니다.
> Bản trình diễn. Mọi dữ liệu đều là **dữ liệu giả lập**.

## Cách web hoạt động (3 bước)

1. **Lọc cứng bằng quy tắc** (không tốn token): hết hạn, sai năm học, không có ngôn ngữ chung, không trùng giờ, không có kỹ năng đội cần, thì loại và ghi rõ lý do.
2. **Chấm điểm bằng quy tắc** để xếp hạng: lĩnh vực quan tâm, kỹ năng khớp, mục tiêu, giờ trùng, mức cam kết. Kết quả ổn định, giải thích được, không hiện %.
3. **Claude chỉ giải thích 3 gợi ý đầu** khi người dùng bấm nút. Dữ liệu gửi đi đã được lọc gọn. Kết quả được lưu lại: dữ liệu không đổi thì không gọi lại.

Ngoài ra Claude chuyển phần giới thiệu tự do (Hàn/Anh/Việt) thành các mục hồ sơ, **chỉ được chọn trong danh sách kỹ năng cố định**. Server kiểm tra lại và bỏ mọi mã lạ. Người dùng xem rồi mới bấm "Áp dụng".

```
Trình duyệt ──► /api/ai (server, giữ key) ──► Claude API
     ▲                                          │
     └──────── kết quả + số token thật ◄────────┘
```

## Biến môi trường (cài trên Vercel → Settings → Environment Variables)

| Tên | Bắt buộc | Ý nghĩa |
|---|---|---|
| `ANTHROPIC_API_KEY` | Có (để bật AI) | Key do trường cấp. **Chỉ dán trên Vercel, không bao giờ đưa vào code.** |
| `ANTHROPIC_MODEL` | Nên có | Tên model trường cho phép. Mặc định: `claude-haiku-5-5`. |
| `DEMO_PASSCODE` | Nên có | Mật khẩu để vào web. Không đặt thì ai có link cũng vào được. |
| `AI_MAX_CALLS_PER_10MIN` | Không | Giới hạn số lần gọi AI mỗi 10 phút (mặc định 40). |

Đổi biến môi trường xong phải **Redeploy** thì mới có hiệu lực.

## Cấu trúc thư mục

| Đường dẫn | Nội dung |
|---|---|
| `src/data/taxonomy.ts` | Danh sách cố định: kỹ năng, lĩnh vực, mục tiêu, vai trò, ngôn ngữ, khung giờ (3 thứ tiếng) |
| `src/data/sample.ts` | **Dữ liệu giả lập tạm thời**, sẽ thay bằng bộ dữ liệu chính thức |
| `src/lib/match.ts` | Logic lọc + chấm điểm (gợi ý cuộc thi, ghép đội 2 chiều) |
| `src/app/api/ai/route.ts` | Server gọi Claude: prompt, giới hạn, kiểm tra kết quả |
| `src/lib/langs.ts` | Bật/tắt ngôn ngữ giao diện (hiện: 한국어, English; tiếng Việt đã dịch sẵn; dự kiến 中文, 日本語, हिन्दी) |
| `src/lib/i18n.ts` | Chữ giao diện (bắt buộc KO + EN; thiếu ngôn ngữ khác thì tự dùng EN) |
| `src/app/*/page.tsx` | Các màn hình: hồ sơ, gợi ý cuộc thi, tìm đội, tìm thành viên, lời mời, quản trị |
| `src/proxy.ts` | Khoá bằng mật khẩu demo |

## Chạy trên máy (dành cho người phát triển)

```bash
npm install
npm run dev
```

Không có `ANTHROPIC_API_KEY` thì web vẫn chạy, nhưng nút AI báo "AI chưa kết nối".

## Trạng thái

- **Đã làm (v0.2):** hồ sơ + AI chuyển thành các mục; gợi ý cuộc thi (đổi mục tiêu thì thứ tự đổi); ghép đội 2 chiều; ứng tuyển / mời / chấp nhận / từ chối; ghi log token; mật khẩu demo; giao diện tiếng Hàn (chính) + tiếng Anh; tông đỏ – trắng theo DSU.
- **Dự kiến:** dán thông báo cuộc thi để AI trích xuất; yêu cầu hỗ trợ + AI tóm tắt nhu cầu; nút dịch; chỉnh sửa hồ sơ đội; bộ dữ liệu giả chính thức kèm đáp án mong đợi.
