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
  title: "Terms of Use — Linq",
  description: "The terms that apply when you use Linq.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use">
      <p>
        These terms are an agreement between you and {COMPANY} (&ldquo;Linq&rdquo;,
        &ldquo;we&rdquo;, &ldquo;us&rdquo;). They apply when you use the Linq
        mobile apps, the web app, our Telegram bot and this website. By creating
        an account or using Linq, you agree to them and to our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>Who can use Linq</h2>
      <p>
        You must be at least 18, able to enter a binding contract, and allowed by
        the law where you live to use Linq. You must not use Linq if you are
        subject to sanctions.
      </p>

      <h2>What Linq does</h2>
      <p>
        Linq lets you fund a wallet in naira or crypto, cash out to Nigerian bank
        accounts, send money, buy and sell crypto, move crypto between networks,
        pay bills and save. Some features are provided with third-party
        partners, may have their own terms, and may not be available to
        everyone.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>Give us accurate details and keep them up to date.</li>
        <li>You may hold one account, and it is for your own use.</li>
        <li>
          Keep your password, PIN and device secure. You are responsible for
          activity on your account unless the law says otherwise.
        </li>
        <li>
          Tell us straight away at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> if you think
          someone else has accessed your account.
        </li>
      </ul>

      <h2>Verification and limits</h2>
      <p>
        We must verify your identity before you can use some features. Your
        limits depend on your verification level. We may ask for more
        information at any time, and may delay or decline a transaction while we
        review it.
      </p>

      <h2>Fees and exchange rates</h2>
      <p>
        We show applicable fees and exchange rates before you confirm a
        transaction. Rates change quickly, and the rate that applies is the one
        shown when you confirm.
      </p>

      <h2>Your transactions</h2>
      <p>
        Check every recipient, network and amount before you confirm. Blockchain
        transactions cannot be reversed, and crypto sent to the wrong address or
        network may be lost permanently. Bank and network delays can happen
        outside our control.
      </p>

      <h2>Crypto risks</h2>
      <p>
        Crypto prices can fall sharply, and you could lose some or all of the
        value you hold. Stablecoins can lose their peg. Networks can fail or be
        attacked. Past performance tells you nothing about future results. Linq
        does not give financial, investment, legal or tax advice, and you are
        responsible for your own decisions and taxes.
      </p>

      <h2>What you must not do</h2>
      <ul>
        <li>
          Use Linq for money laundering, terrorist financing, fraud or anything
          else unlawful.
        </li>
        <li>
          Use another person&rsquo;s identity or account, or let someone else use
          yours.
        </li>
        <li>
          Try to break, overload, reverse engineer or bypass the security of
          Linq.
        </li>
        <li>Abuse promotions or the referral programme.</li>
      </ul>

      <h2>Suspending or closing accounts</h2>
      <p>
        We may restrict, suspend or close your account, or hold funds, if the law
        requires it, if we reasonably suspect fraud or a breach of these terms,
        or to protect you or other users. Where the law allows, we will tell you
        why.
      </p>
      <p>
        You can close your account at any time. See{" "}
        <Link href="/delete-account">how to delete your account</Link>.
      </p>

      <h2>Errors</h2>
      <p>
        If money or crypto reaches your account by mistake, it is not yours to
        keep. We may correct the error, and you agree to help us do so.
      </p>

      <h2>Our service and our liability</h2>
      <p>
        We work to keep Linq available and accurate, but we cannot promise it
        will always be uninterrupted or free of errors. To the extent the law
        allows, we are not liable for indirect or consequential loss, or for loss
        caused by events outside our reasonable control, including failures of
        banks, networks or third-party services. Nothing in these terms limits a
        liability or consumer right that the law does not allow us to limit.
      </p>

      <h2>Our intellectual property</h2>
      <p>
        The Linq name, logo, apps and content belong to us or our licensors. You
        may use them only to use Linq as intended.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms. We will post changes here and update the date
        above, and tell you in the app or by email if a change significantly
        affects you. If you continue to use Linq after a change, you accept it.
      </p>

      <h2>Governing law and disputes</h2>
      <p>
        These terms are governed by the laws of the Federal Republic of Nigeria.
        Please contact us first so we can try to resolve any problem. If we
        cannot, the courts of Nigeria will have jurisdiction.
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
