import QRCode from "qrcode";
import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.NEXT_PUBLIC_EMAIL,
    pass: process.env.NEXT_PUBLIC_PASSWORD,
  },
});

interface Attendee {
  name: string;
  email: string;
}

export const POST = async (req: NextRequest) => {
  const listOfAttendees: Attendee[] = await req.json();

  for (const attendee of listOfAttendees) {
    const qrCodeLink = `https://google.com`; // replace with your actual link
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeLink);

    await transport.sendMail({
      from: "CoderBase",
      to: attendee.email,
      subject: "Event Invitation",
      html: `
        <p>Hello ${attendee.name}, you are invited to the event</p>
        <img src="${qrCodeDataUrl}" alt="QR Code" />
      `,
    });
  }

  return NextResponse.json({
    result: 200,
    message: "Emails sent successfully",
  });
};
