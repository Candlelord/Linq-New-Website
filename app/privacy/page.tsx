import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import {
  COMPANY,
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  SUPPORT_PHONE_HREF,
} from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy — Linq",
  description:
    "How Linq collects, uses, shares and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        Linq is operated by {COMPANY} (&ldquo;Linq&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo;). We are the data controller of the personal data
        described here. This policy applies to the Linq mobile apps, the web app
        at app.uselinq.xyz, our Telegram bot and this website, and it is written
        to meet the Nigeria Data Protection Act 2023.
      </p>

      <h2>Data we collect</h2>
      <h3>Data you give us</h3>
      <ul>
        <li>
          <strong>Account details:</strong> your first and last name, email
          address, phone number, username, password and profile photo, and any
          referral code you enter.
        </li>
        <li>
          <strong>Identity details:</strong> your Bank Verification Number (BVN)
          or National Identification Number (NIN), and a selfie taken in the
          app.
        </li>
        <li>
          <strong>Payment details:</strong> bank account details, saved
          beneficiaries, crypto wallet addresses, and the phone, meter or
          account numbers you pay bills for.
        </li>
        <li>
          <strong>Messages:</strong> what you send our support team, by in-app
          chat or any other channel.
        </li>
      </ul>
      <h3>Data created when you use Linq</h3>
      <ul>
        <li>
          <strong>Transactions:</strong> deposits, transfers, trades, savings,
          bill payments, balances and related records.
        </li>
        <li>
          <strong>Device and technical data:</strong> a device identifier we
          create when you install the app, your device model and platform, app
          version, push notification token, IP address and error logs.
        </li>
        <li>
          <strong>Usage data:</strong> which features you use and when.
        </li>
        <li>
          <strong>Telegram data:</strong> your Telegram user ID and username, if
          you use our bot.
        </li>
      </ul>
      <h3>Data from other sources</h3>
      <p>
        Identity verification providers confirm your details against official
        records. Screening providers tell us whether you appear on sanctions or
        politically exposed person lists, or in adverse media.
      </p>
      <h3>Permissions on your phone</h3>
      <ul>
        <li>
          <strong>Contacts:</strong> optional. You can pick a number to buy
          airtime or data for. We only receive the number you pick, and we do
          not upload your contact list.
        </li>
        <li>
          <strong>Camera:</strong> used for your verification selfie. The photo
          is removed from your phone once it has been read for upload.
        </li>
        <li>
          <strong>Photos:</strong> used for your profile photo, and to save
          receipts when you ask us to.
        </li>
        <li>
          <strong>Fingerprint or face unlock:</strong> handled by your phone. We
          never receive your biometric data from this feature.
        </li>
        <li>
          <strong>Notifications:</strong> used to send you alerts about your
          account.
        </li>
      </ul>
      <p>The app does not collect your location.</p>

      <h2>How we use your data, and why we are allowed to</h2>
      <ul>
        <li>
          <strong>To provide Linq</strong>, including creating your account,
          moving your money and sending receipts and alerts. We do this to
          perform our contract with you.
        </li>
        <li>
          <strong>To verify your identity and meet our legal duties</strong>,
          including KYC, anti-money laundering checks, sanctions and politically
          exposed person screening, and reports to authorities. We do this to
          comply with the law.
        </li>
        <li>
          <strong>To keep Linq secure</strong>, including preventing fraud,
          protecting accounts and fixing faults. We do this in our legitimate
          interests and to comply with the law.
        </li>
        <li>
          <strong>To support you and improve Linq</strong>, including answering
          your messages and understanding which features are used. We do this in
          our legitimate interests.
        </li>
        <li>
          <strong>To tell you about Linq</strong>, including new features and
          offers. We do this with your consent or in our legitimate interests,
          and you can opt out at any time.
        </li>
      </ul>
      <p>
        We do not sell your personal data, and the app does not show third-party
        advertising. A screening match is reviewed by a member of our team.
      </p>

      <h2>Who we share it with</h2>
      <p>We share only what each party needs:</p>
      <ul>
        <li>identity verification and compliance screening providers;</li>
        <li>
          banks, payment processors, wallet and account providers, liquidity and
          blockchain service providers, and bill payment providers that carry
          out your transactions;
        </li>
        <li>
          investment product providers, if you choose to use those products;
        </li>
        <li>
          cloud hosting, push notification, email and customer support
          providers;
        </li>
        <li>
          regulators, law enforcement and courts, where the law requires it or
          to protect our rights and users;
        </li>
        <li>a buyer or successor, if our business is reorganised or sold.</li>
      </ul>
      <p>
        Transactions you send to a blockchain are public and permanent. We
        cannot change or delete them.
      </p>

      <h2>Transfers outside Nigeria</h2>
      <p>
        Some of our service providers store or process data outside Nigeria.
        When that happens, we rely on the safeguards the Nigeria Data Protection
        Act allows, such as contractual protections.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep your data for as long as your account is open. After that, we
        keep identity, transaction and compliance records for up to seven years,
        or longer if the law requires it. We delete or anonymise other data when
        we no longer need it. See{" "}
        <Link href="/delete-account">how to delete your account</Link>.
      </p>

      <h2>How we protect it</h2>
      <p>
        Data is encrypted in transit between the app and our servers, and access
        is limited to people who need it for their work. No system is completely
        secure, so please keep your password and PIN private and tell us
        straight away if you think your account has been accessed.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask to access your data, correct it, delete it, receive a copy
        in a portable format, or object to or restrict how we use it. Where we
        rely on consent, you can withdraw it at any time. Some requests may be
        limited by our legal duty to keep records. Email us to use any of these
        rights.
      </p>
      <p>
        If you are not happy with our response, you can complain to the Nigeria
        Data Protection Commission.
      </p>

      <h2>Children</h2>
      <p>
        Linq is only for people aged 18 and over. We do not knowingly collect
        data from children. If you believe a child has given us data, please
        contact us.
      </p>

      <h2>This website</h2>
      <p>
        This website does not use advertising or analytics cookies. Our hosting
        provider keeps standard technical logs, such as IP addresses, to run and
        secure the site.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We will post any changes here and update the date above. If a change
        significantly affects you, we will also tell you in the app or by email.
      </p>

      <h2>Contact us</h2>
      <p>
        {COMPANY}
        <br />
        Email: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        <br />
        Phone: <a href={SUPPORT_PHONE_HREF}>{SUPPORT_PHONE}</a>
      </p>
    </LegalPage>
  );
}
