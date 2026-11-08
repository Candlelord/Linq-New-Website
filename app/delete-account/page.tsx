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
  title: "Delete your account — Linq",
  description:
    "How to request deletion of your Linq account and data, and what we keep.",
};

const MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
  "Delete my Linq account",
)}`;

export default function DeleteAccountPage() {
  return (
    <LegalPage title="Delete your account" updated={false}>
      <p>
        This page explains how to delete your account in the Linq app, which is
        provided by {COMPANY}, and what happens to your data.
      </p>

      <h2>Before you start</h2>
      <p>
        Withdraw any money or crypto left in your account, and wait for pending
        transactions to finish. We cannot complete a deletion while your account
        still holds funds or has a transaction in progress.
      </p>

      <h2>How to request deletion</h2>
      <h3>In the app</h3>
      <ol>
        <li>
          Open <strong>Settings</strong> and go to your{" "}
          <strong>Profile</strong>.
        </li>
        <li>
          Tap <strong>Delete account</strong>.
        </li>
        <li>
          Choose how to contact support, and tell us you want to delete your
          account.
        </li>
      </ol>
      <h3>Without the app</h3>
      <p>
        Email <a href={MAILTO}>{SUPPORT_EMAIL}</a> from the address on your
        account, with the subject &ldquo;Delete my Linq account&rdquo;. You can
        also call <a href={SUPPORT_PHONE_HREF}>{SUPPORT_PHONE}</a>.
      </p>

      <h2>What happens next</h2>
      <p>
        We will confirm that the request came from you, and we may ask you to
        verify your identity. We aim to finish within 30 days and will tell you
        when it is done. After that, you will not be able to sign in or get your
        account back.
      </p>

      <h2>What we delete</h2>
      <ul>
        <li>Your profile, including your username and profile photo</li>
        <li>Saved beneficiaries</li>
        <li>Device identifiers and push notification tokens</li>
        <li>Usage data linked to you</li>
        <li>Any other personal data we are not required to keep</li>
      </ul>

      <h2>What we keep, and for how long</h2>
      <p>
        The law requires financial companies to keep certain records to prevent
        fraud and money laundering. We keep the following for up to seven years,
        or longer if the law requires it, and we restrict how they can be used:
      </p>
      <ul>
        <li>Your name, contact details and identity verification records</li>
        <li>Transaction records</li>
        <li>Compliance screening records</li>
        <li>Support messages relating to a transaction or dispute</li>
      </ul>
      <p>
        Transactions recorded on a public blockchain cannot be deleted by
        anyone. Read our <Link href="/privacy">Privacy Policy</Link> for more
        detail.
      </p>
    </LegalPage>
  );
}
