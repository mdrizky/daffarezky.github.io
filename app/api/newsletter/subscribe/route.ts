import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 1. Save to Supabase
    const { error: dbError } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email, is_active: true }]);

    if (dbError) {
      // If already subscribed, we can still return success or a specific message
      if (dbError.code === '23505') {
        return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
      }
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // 2. Send Welcome Email via Resend (Optional - if API Key is set)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey && resendApiKey !== 'placeholder') {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(resendApiKey);

        await resend.emails.send({
          from: 'Portfolio Newsletter <newsletter@daffarezky.app>',
          to: email,
          subject: 'Welcome to my Newsletter!',
          html: `<p>Hi! Thank you for subscribing to my portfolio newsletter. You'll receive updates on my latest projects and articles.</p>`,
        });
      } catch (emailError) {
        console.error('Newsletter email error:', emailError);
        // Don't fail the request if email sending fails, as it's already in DB
      }
    }

    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 200 });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
