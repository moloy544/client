import NavigateBackTopNav from "@/components/NavigateBackTopNav";
import { appConfig } from "@/config/config";

export const metadata = {
    title: {
        absolute: 'Privacy Policy - Movies Bazar',
    },
    description: 'Learn about the privacy practices at Movies Bazar. Discover how we protect your data, ensure user safety, and enhance your movie streaming experience across Hollywood, Bollywood, and South Cinema.',
    alternates: {
        canonical: `${appConfig.appDomain}/privacy-policy`
    },
};

export default function PrivacyPractices() {
    return (
        <>
            <NavigateBackTopNav title="Privacy policy" />
            <main className="w-full px-12 mobile:px-3 py-8 mobile:py-5 bg-custom-dark-bg">
                <h1 className="text-3xl font-bold text-gray-100 mb-6">Privacy Practices</h1>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-100 mb-4">Free and Easy Access</h2>
                    <p className="text-gray-200 leading-relaxed">
                        Our site is free to use, and there&lsquo;s no need to create an account or provide sensitive details. You can fully enjoy our content without any passwords or sign-ups. For features like “Watch Later” or restriction settings, we use cookies and localStorage to save your preferences directly in your browser.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-100 mb-4">Optional Contact Information</h2>
                    <p className="text-gray-200 leading-relaxed">
                        Sometimes, we may ask for an email or contact info to keep you updated on new features or content. This is entirely optional and helps us communicate updates if you’re interested—there’s no obligation to share any details.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-100 mb-4">Enhanced User Experience</h2>
                    <p className="text-gray-200 leading-relaxed">
                        We use cookies and localStorage to provide a seamless user experience:
                    </p>
                    <ul className="list-disc list-inside text-gray-200 leading-relaxed">
                        <li>
                            <strong>Watch Later and Preferences:</strong> Save movies to your Watch Later list and personalize settings, making it easy to pick up where you left off.
                        </li>
                        <li>
                            <strong>Restriction Management:</strong> Set viewing restrictions, which our site will remember, allowing easy control over content types without the need to reconfigure settings each visit.
                        </li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-100 mb-4">Submission Requests</h2>
                    <p className="text-gray-200 leading-relaxed">
                        We welcome your content requests! Our team reviews all submissions to ensure high-quality additions. Once your request is approved, you&lsquo;ll find it in our recently updated list.
                    </p>
                    <p className="text-gray-200 leading-relaxed mt-4">
                        <strong>Note:</strong> The chance of adding anime content is currently very low. Additionally, we do not accept requests for 18+ content; such requests will be rejected.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-100 mb-4">User Safety</h2>
                    <p className="text-gray-200 leading-relaxed">
                        Our site may host content that includes copyrighted material. However, users can safely enjoy this content without concern. We take full responsibility for managing copyright issues, ensuring that our users have a secure and enjoyable viewing experience.
                    </p>
                </section>

                <footer className="text-center text-gray-400 text-sm mt-8">
                    <strong>Last Updated:</strong> 25/10/2024
                </footer>
            </main>
        </>
    );
}
