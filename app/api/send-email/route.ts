import QRCode from "qrcode";
import { db } from "@/firebase";
import nodemailer from "nodemailer";
import { doc, getDoc } from "firebase/firestore";
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

  const params = req.nextUrl.searchParams;
  const eventId = params.get("eventId");

  const eventRef = doc(db, "events", String(eventId));
  const eventDoc = await getDoc(eventRef);

  const event = eventDoc.data();

  if (!event) {
    return NextResponse.json({
      result: 404,
      message: "Event not found",
    });
  }

  for (const attendee of listOfAttendees) {
    const qrCodeLink = `https://orange-event-application.vercel.app/api/confirm-attendee?eventId=${eventId}&email=${attendee.email}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeLink);

    await transport.sendMail({
      from: "CoderBase",
      to: attendee.email,
      subject: `Invitation to ${event.title}`,
      html: ` 
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p>Dear ${attendee.name},</p>
          <p>We are delighted to invite you to ${
            event.title
          }, organized by Orange Event management Team. The event will take place on ${event.date
        .toDate()
        .toLocaleDateString()} at ${event.location}. </p>
          <p>Below are the details of the event:</p>
          <ul>
              <li><strong>Event Name:</strong> ${event.title}</li>
              <li><strong>Date:</strong> ${event.date
                .toDate()
                .toLocaleDateString()}</li>
              <li><strong>Time:</strong> ${event.time}</li>
              <li><strong>Location:</strong> ${event.location}</li>
              <li><strong>Description:</strong> ${event.description}</li>
          </ul>
          <p>To access the event, please find your unique QR code attached to this email. This QR code will serve as your entry pass.</p>
          <img src="${qrCodeDataUrl}" alt="QR Code" />
          <p>We look forward to your presence and contribution to ${
            event.title
          }.</p>
          <p>Best regards,</p>
          <p>Orange Event management Team</p>
      </div>
        `,
    });
  }

  return NextResponse.json({
    result: 200,
    message: "Emails sent successfully",
  });
};
