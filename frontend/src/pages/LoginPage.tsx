import LoginBrand from '../components/login/LoginBrand'
import LoginForm from '../components/login/LoginForm'

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <LoginBrand />
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <LoginForm />
            </div>
        </div>
    )
}
