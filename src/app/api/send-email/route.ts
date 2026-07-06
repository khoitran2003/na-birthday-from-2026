import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("Missing RESEND_API_KEY environment variable");
      return NextResponse.json(
        { success: false, error: "RESEND_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const body = await req.json();

    const {
      food,
      activities,
      dresscode,
      notes,
      surveyEmoji,
      surveyFeedback,
      sender = "Bé Tin",
      recipient = "Bé Na"
    } = body;

    const formattedActivities = Array.isArray(activities) && activities.length > 0
      ? activities.map((act: string) => `<li style="margin-bottom: 6px; font-size: 15px; color: #2d3748;">${act}</li>`).join("")
      : '<li style="font-size: 15px; color: #a0aec0;">Chưa lựa chọn</li>';

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; border-radius: 16px; background: #ffffff; border: 1px solid #edf2f7; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #ff758c; margin-bottom: 24px;">
          <span style="font-size: 40px; display: block; margin-bottom: 8px;">🎂💌</span>
          <h1 style="color: #ff4b72; margin: 0; font-size: 24px; font-weight: 700;">Lịch Trình Sinh Nhật Của Na</h1>
          <p style="color: #718096; font-size: 14px; margin-top: 6px;">Phản hồi trực tiếp từ ${recipient} dành cho ${sender} ❤️</p>
        </div>

        <!-- Section 1: Food -->
        <div style="margin-bottom: 22px; background: #fff5f7; padding: 16px 20px; border-radius: 12px; border-left: 5px solid #ff4b72;">
          <h3 style="color: #9b2c2c; font-size: 15px; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.5px;">🍲 1. Món Ăn Lựa Chọn</h3>
          <p style="margin: 0; font-size: 17px; font-weight: bold; color: #c53030;">${food || "Chưa lựa chọn"}</p>
        </div>

        <!-- Section 2: Activities -->
        <div style="margin-bottom: 22px; background: #f0f4fe; padding: 16px 20px; border-radius: 12px; border-left: 5px solid #3182ce;">
          <h3 style="color: #2c5282; font-size: 15px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">🛵 2. Hoạt Động Tiếp Theo</h3>
          <ul style="margin: 0; padding-left: 20px;">
            ${formattedActivities}
          </ul>
        </div>

        <!-- Section 3: Dresscode -->
        <div style="margin-bottom: 22px; background: #fefcbf; padding: 16px 20px; border-radius: 12px; border-left: 5px solid #d69e2e;">
          <h3 style="color: #744210; font-size: 15px; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.5px;">👗 3. Tone Màu Trang Phục (Dresscode)</h3>
          <p style="margin: 0; font-size: 17px; font-weight: bold; color: #975a16;">${dresscode || "Chưa lựa chọn"}</p>
        </div>

        <!-- Section 4: Notes -->
        <div style="margin-bottom: 22px; background: #edf2f7; padding: 16px 20px; border-radius: 12px; border-left: 5px solid #4a5568;">
          <h3 style="color: #2d3748; font-size: 15px; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 0.5px;">💌 4. Dặn Dò & Lời Nhắn Thêm</h3>
          <p style="margin: 0; font-size: 15px; color: #2d3748; white-space: pre-wrap; line-height: 1.5;">${notes ? notes : "(Không có dặn dò thêm)"}</p>
        </div>

        ${(surveyEmoji || surveyFeedback) ? `
        <!-- Section 5: Survey Feedback (if provided) -->
        <div style="margin-top: 26px; padding-top: 18px; border-top: 1.5px dashed #cbd5e0; background: #faf5ff; padding: 16px 20px; border-radius: 12px; border-left: 5px solid #805ad5;">
          <h3 style="color: #553c9a; font-size: 15px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">💬 Đánh Giá & Cảm Nhận Về Bức Thư</h3>
          ${surveyEmoji ? `<p style="margin: 0 0 6px 0; font-size: 16px;">Cảm xúc: <span style="font-size: 22px;">${surveyEmoji}</span></p>` : ''}
          ${surveyFeedback ? `<p style="margin: 0; font-size: 15px; color: #44337a; white-space: pre-wrap;">"${surveyFeedback}"</p>` : ''}
        </div>
        ` : ''}

        <!-- Footer -->
        <div style="text-align: center; margin-top: 28px; padding-top: 16px; border-top: 1px solid #edf2f7; font-size: 12px; color: #a0aec0;">
          <p style="margin: 0;">Gửi từ hệ thống <strong>Na Birthday Plan</strong> 💖</p>
          <p style="margin: 4px 0 0 0;">Thời gian: ${new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</p>
        </div>

      </div>
    `;

    // Attempt sending from requested domain na-birthday-plan@enkoi.dev
    let primaryFrom = "Na Birthday Plan <na-birthday-plan@enkoi.dev>";
    let targetTo = "anhkhoi246813579@gmail.com";

    let sendResult = await resend.emails.send({
      from: primaryFrom,
      to: [targetTo],
      subject: `💌 Phản Hồi Lịch Trình Sinh Nhật Của ${recipient}!`,
      html: htmlContent
    });

    // Fallback if domain is unverified on Resend testing environment
    if (sendResult.error) {
      console.warn("Primary email send returned error, trying fallback domain on Resend:", sendResult.error);
      sendResult = await resend.emails.send({
        from: "Na Birthday Plan <onboarding@resend.dev>",
        to: [targetTo],
        subject: `💌 Phản Hồi Lịch Trình Sinh Nhật Của ${recipient}!`,
        html: htmlContent
      });
    }

    if (sendResult.error) {
      console.error("Resend send email error:", sendResult.error);
      return NextResponse.json({ success: false, error: sendResult.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: sendResult.data });
  } catch (error: any) {
    console.error("API send-email error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
