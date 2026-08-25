import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Sparkles, AlertCircle, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  rememberMe: z.boolean().optional(),
})

type LoginFormInputs = z.infer<typeof loginSchema>

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    }
  })

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setServerError('')
      const validation = loginSchema.safeParse(data)
      if (!validation.success) {
        setServerError(validation.error.issues[0].message)
        return
      }

      await login(data.email)
      // Navigate to Welcome Onboarding after login
      navigate('/welcome')
    } catch (err) {
      setServerError('Invalid email or password. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex bg-background text-text-primary select-none">
      
      {/* Left Branding Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 p-12 flex-col justify-between relative overflow-hidden">
        {/* Floating background gradient blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-10%] w-[25vw] h-[25vw] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

        <div className="flex items-center gap-3 z-10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500 text-white font-black text-xl shadow-apple">
              L
            </div>
            <span className="font-extrabold text-sm text-white tracking-wide">LifeOS</span>
          </Link>
        </div>

        <div className="space-y-6 z-10 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles size={10} className="text-indigo-400" />
            <span>Developer Sandbox Workspace</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            The command center <br />
            for your entire life.
          </h2>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
            LifeOS integrates your task database, routine streaks, ledger cash flows, and note workspace into a unified, secure, local environment.
          </p>
        </div>

        <div className="z-10 flex items-center gap-2 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>Local Sandbox Cache Encrypted</span>
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 bg-background relative">
        <div className="flex justify-between items-center h-12">
          <Link to="/" className="flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors">
            <ArrowLeft size={14} />
            <span>Back to site</span>
          </Link>
          <span className="text-xs text-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-500 font-bold hover:underline">
              Sign Up
            </Link>
          </span>
        </div>

        <div className="max-w-md w-full mx-auto my-auto space-y-8">
          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tight text-text-primary">Welcome back</h3>
            <p className="text-xs sm:text-sm text-text-secondary font-medium">
              Enter your details to open your productivity OS workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-500 text-xs font-semibold flex items-center gap-2 border border-red-100 dark:border-red-950/40">
                <AlertCircle size={14} />
                <span>{serverError}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-secondary block">Email address</label>
              <input
                type="email"
                placeholder="varun@example.com"
                {...register('email')}
                className={`w-full px-3.5 py-2.5 bg-muted/50 border rounded-xl text-sm focus:outline-none transition-all placeholder:text-text-secondary/50 text-text-primary ${
                  errors.email ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-indigo-500'
                }`}
              />
              {errors.email && (
                <span className="text-[10px] text-red-500 font-semibold">{errors.email.message}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-text-secondary block">Password</label>
                <Link to="/forgot-password" className="text-[10px] text-indigo-500 font-bold hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full pl-3.5 pr-10 py-2.5 bg-muted/50 border rounded-xl text-sm focus:outline-none transition-all placeholder:text-text-secondary/50 text-text-primary ${
                    errors.password ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-indigo-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-text-secondary hover:text-text-primary"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-[10px] text-red-500 font-semibold">{errors.password.message}</span>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                {...register('rememberMe')}
                className="w-4 h-4 rounded border-border text-indigo-600 focus:ring-indigo-500 accent-indigo-500"
              />
              <label htmlFor="rememberMe" className="text-xs text-text-secondary font-medium select-none cursor-pointer">
                Remember my workspace credentials
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-apple transition-colors flex items-center justify-center gap-2 text-xs"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Unlock Workspace</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Social login divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-[10px] text-text-secondary/60 uppercase font-bold tracking-wider">
              Or continue with
            </span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          {/* Google SSO Login */}
          <button
            type="button"
            onClick={() => login('google@example.com', 'Varun Google').then(() => navigate('/welcome'))}
            className="w-full py-2.5 border border-border hover:bg-muted bg-surface text-text-primary font-bold text-xs rounded-xl shadow-apple transition-colors flex items-center justify-center gap-2"
          >
            {/* Google Icon SVG */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.68 14.94 1 12 1 7.37 1 3.4 3.63 1.45 7.45l3.78 2.93C6.18 7.37 8.87 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.46h6.46c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.98 3.39-4.89 3.39-8.49z"
              />
              <path
                fill="#FBBC05"
                d="M5.23 14.52c-.24-.73-.38-1.5-.38-2.3a7.88 7.88 0 0 1 .38-2.3L1.45 6.99A11.96 11.96 0 0 0 0 12c0 1.83.41 3.57 1.15 5.13l4.08-2.61z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.08 7.96-2.92l-3.66-2.84c-1.01.68-2.3 1.08-3.9 1.08-3.13 0-5.82-2.33-6.77-5.34l-3.78 2.93C3.4 20.37 7.37 23 12 23z"
              />
            </svg>
            <span>Google Auth SSO</span>
          </button>
        </div>

        <div className="text-center text-[10px] text-text-secondary/60">
          <span>By unlocking your workspace you agree to our Terms of Use and Privacy Policy.</span>
        </div>
      </div>

    </div>
  )
}
