import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="mx-auto">
      In order to sign up, you&apos;ll need to follow your individual invitation
      link, which you should have recieved in an email with the subject line{" "}
      <span className="font-bold">
        &quot;Invitation to join The Curve&quot;
      </span>
      . If you did not receive this invitation, but believe you should have,
      email <span className="font-bold">rachel@thecurve.is</span>.
    </div>
  );
}
