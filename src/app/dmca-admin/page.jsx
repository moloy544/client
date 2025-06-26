import AuthWrapper from './AuthWrapper'
import DmcaAdminDashboard from './Dashboard'

export const metadata = {
    title: {
        absolute: 'DMCA Admin Dashboard | MoviesBazar',
    },
};

function page() {
    return (
        <AuthWrapper>
            <DmcaAdminDashboard />
        </AuthWrapper>
    )
}

export default page
