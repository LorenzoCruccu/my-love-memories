import React from "react";

const TermsAndConditions: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-10 lg:px-20">
      <h1 className="text-4xl font-extrabold text-center mb-8">Terms and Conditions</h1>
      <div className="space-y-8 bg-white shadow-md p-8 rounded-lg">
        <section>
          <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
          <p className="mt-4">
            By accessing and using the Service, you agree to be bound by these Terms, which constitute a legal agreement between you and [MyLoveMemories]. If you do not agree to these Terms, you must immediately stop using the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">2. GDPR Compliance and Data Collection</h2>
          <p className="mt-4">
            In accordance with the General Data Protection Regulation (GDPR), we are committed to protecting your personal data. By using our Service and/or logging in, you agree that your personal data may be collected and stored in our database. This includes data necessary for the operation of the Service, such as your login information, and any content you provide.
          </p>
          <p className="mt-4">
            We collect and process anonymous behavioral data for the purpose of improving our services. By using the Service, you consent to the collection and analysis of such anonymous data. This data does not include personal information and cannot be used to identify you.
          </p>
          <p className="mt-4">
            If you wish to access, modify, or delete your personal data, or if you have any questions about how we handle your data, please refer to our <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a> or contact us directly at [mylovememories@gmail.com].
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">3. User Responsibilities</h2>
          <p className="mt-4">
            You agree to use the Service only for lawful purposes and in accordance with these Terms. You are responsible for ensuring that your use of the Service does not violate any applicable laws, regulations, or the rights of third parties.
          </p>
          <ul className="list-disc list-inside mt-4">
            <li>You must not post or upload any content that is illegal, defamatory, obscene, racist, offensive, or otherwise inappropriate.</li>
            <li>You agree not to use the Service to harass, abuse, or harm others.</li>
            <li>We reserve the right to remove any content that violates these Terms or is otherwise objectionable without notice.</li>
            <li>Repeated violations or severe offenses may result in suspension or termination of your account.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold">4. User-Generated Content</h2>
          <p className="mt-4">
            You may mark locations, share moods, and associate memories with your partner through the Service. By submitting content, you grant us a non-exclusive, royalty-free, worldwide license to use, modify, and display your content as part of the Service. Offensive, racist, or harmful content will not be tolerated and will be removed at our discretion.
          </p>
          <p className="mt-4">
            You are solely responsible for the content you provide and its accuracy. We do not endorse or verify user-generated content and cannot be held responsible for any content posted by users.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">5. Data Storage Upon Login</h2>
          <p className="mt-4">
            When you log in to the Service, your personal data will be stored in our database. This data may include your name, email address, and any other information you provide during the registration or use of the Service.
          </p>
          <p className="mt-4">
            Your data will be stored securely and in compliance with GDPR. We will not share your personal data with third parties without your explicit consent, except when required by law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">6. Limitation of Liability</h2>
          <p className="mt-4">
            To the fullest extent permitted by law, [MyLoveMemories] shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of or related to your use of the Service, including but not limited to errors, interruptions, or unauthorized access to your personal data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">7. Governing Law</h2>
          <p className="mt-4">
            These Terms are governed by and construed in accordance with the laws of [Europe], without regard to its conflict of law principles. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of [Europe].
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">8. Changes to These Terms</h2>
          <p className="mt-4">
            We reserve the right to update or modify these Terms at any time. Any changes will be posted on this page, and the &quot;Last Updated&quot; date will be revised. It is your responsibility to review these Terms periodically. Your continued use of the Service after changes are posted constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">9. Contact Us</h2>
          <p className="mt-4">
            If you have any questions or concerns about these Terms, please contact us at:
          </p>
          <p className="mt-4">
            <strong>Email:</strong> mylovememories@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
