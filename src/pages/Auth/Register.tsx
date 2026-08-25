import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Eye, EyeOff, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Please enter a valid age',
  }),
  profession: z.string().min(2, 'Please specify your profession'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type RegisterFormInputs = z.infer<typeof registerSchema>

export const Register: React.FC = () => {
  const navigate = useNavigate()
  const { register: registerUser, isLoading } = useAuthStore()
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState<{ score: number; label: string; color: string }>({
    score: 0,
    label: 'Too short',
    color: 'bg-red-500',
  })

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormInputs>({
    defaultValues: {
      fullName: '',
      email: '',
      age: '',
      profession: '',
      password: '',
      confirmPassword: '',
      terms: false,
    }
  })

  const passwordValue = watch('password')

  // Real-time password strength check
  useEffect(() => {
    if (!passwordValue) {
      setPasswordStrength({ score: 0, label: 'Empty', color: 'bg-border' })
      return
    }
    
    let score = 0
    if (passwordValue.length >= 6) score += 1
    if (passwordValue.length >= 10) score += 1
    if (/[A-Z]/.test(passwordValue)) score += 1
    if (/[0-9]/.test(passwordValue)) score += 1
    if (/[^A-Za-z0-9]/.test(passwordValue)) score += 1

    let label = 'Weak'
    let color = 'bg-red-500'

    if (score >= 4) {
      label = 'Strong'
      color = 'bg-emerald-500'
    } else if (score >= 2) {
      label = 'Medium'
      color = 'bg-amber-500'
    }

    setPasswordStrength({ score, label, color })
  }, [passwordValue])

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      setServerError('')
      const validation = registerSchema.safeParse(data)
      if (!validation.success) {
        setServerError(validation.error.issues[0].message)
        return
      }

      await registerUser({
        fullName: data.fullName,
        email: data.email,
        age: Number(data.age),
        profession: data.profession,
      })

      // Navigate to OTP verification page
      navigate('/verify-email')
    } catch (err) {
      setServerError('Registration failed. Please check your credentials and retry.')
    }
  }

  return (
    <div className="min-h-screen flex bg-background text-text-primary select-none">
      
      {/* Left panel (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-indigo-900 via-indigo-950 to-slate-950 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
        
        <div className="flex items-center gap-3 z-10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500 text-white font-black text-xl shadow-apple">
              L
            </div>
            <span className="font-extrabold text-sm text-white tracking-wide">LifeOS</span>
          </Link>
        </div>

        <div className="space-y-6 z-10 max-w-md">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            Design your workspace settings.
          </h2>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
            Join thousands of professionals, developers, and students organizing their schedules, tracking streaks, and auditing budgets safely in one screen.
          </p>
        </div>

        <div className="z-10 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
          LifeOS Core Sandboxed Framework v1.0.0
        </div>
      </div>

      {/* Right Register Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 bg-background relative overflow-y-auto">
        <div className="flex justify-between items-center h-12">
          <Link to="/login" className="flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors">
            <ArrowLeft size={14} />
            <span>Login instead</span>
          </Link>
          <span className="text-xs text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-500 font-bold hover:underline">
              Log In
            </Link>
          </span>
        </div>

        <div className="max-w-md w-full mx-auto my-auto space-y-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-black tracking-tight text-text-primary">Create workspace</h3>
            <p className="text-xs text-text-secondary font-medium">
              Start building habits and tracking transactions in minutes.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-500 text-xs font-semibold flex items-center gap-2 border border-red-100 dark:border-red-950/40">
                <AlertCircle size={14} />
                <span>{serverError}</span>
              </div>
            )}

            {/* Row 1: Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary block">Full Name</label>
                <input
                  type="text"
                  placeholder="Varun Kumar"
                  {...register('fullName')}
                  className={`w-full px-3.5 py-2 bg-muted/50 border rounded-xl text-sm focus:outline-none transition-all placeholder:text-text-secondary/50 text-text-primary ${
                    errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-indigo-500'
                  }`}
                />
                {errors.fullName && (
                  <span className="text-[10px] text-red-500 font-semibold">{errors.fullName.message}</span>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary block">Email Address</label>
                <input
                  type="email"
                  placeholder="varun@example.com"
                  {...register('email')}
                  className={`w-full px-3.5 py-2 bg-muted/50 border rounded-xl text-sm focus:outline-none transition-all placeholder:text-text-secondary/50 text-text-primary ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-indigo-500'
                  }`}
                />
                {errors.email && (
                  <span className="text-[10px] text-red-500 font-semibold">{errors.email.message}</span>
                )}
              </div>
            </div>

            {/* Row 2: Age & Profession */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary block">Age</label>
                <input
                  type="text"
                  placeholder="24"
                  {...register('age')}
                  className={`w-full px-3.5 py-2 bg-muted/50 border rounded-xl text-sm focus:outline-none transition-all placeholder:text-text-secondary/50 text-text-primary ${
                    errors.age ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-indigo-500'
                  }`}
                />
                {errors.age && (
                  <span className="text-[10px] text-red-500 font-semibold">{errors.age.message}</span>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-secondary block">Profession</label>
                <input
                  type="text"
                  placeholder="React Architect"
                  {...register('profession')}
                  className={`w-full px-3.5 py-2 bg-muted/50 border rounded-xl text-sm focus:outline-none transition-all placeholder:text-text-secondary/50 text-text-primary ${
                    errors.profession ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-indigo-500'
                  }`}
                />
                {errors.profession && (
                  <span className="text-[10px] text-red-500 font-semibold">{errors.profession.message}</span>
                )}
              </div>
            </div>

            {/* Row 3: Passwords */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-secondary block">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('password')}
                      className={`w-full pl-3.5 pr-10 py-2 bg-muted/50 border rounded-xl text-sm focus:outline-none transition-all placeholder:text-text-secondary/50 text-text-primary ${
                        errors.password ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-indigo-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-text-secondary hover:text-text-primary"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-[10px] text-red-500 font-semibold">{errors.password.message}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-secondary block">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('confirmPassword')}
                      className={`w-full pl-3.5 pr-10 py-2 bg-muted/50 border rounded-xl text-sm focus:outline-none transition-all placeholder:text-text-secondary/50 text-text-primary ${
                        errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-indigo-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-text-secondary hover:text-text-primary"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="text-[10px] text-red-500 font-semibold">{errors.confirmPassword.message}</span>
                  )}
                </div>
              </div>

              {/* Password strength meter */}
              {passwordValue && (
                <div className="space-y-1.5 p-2.5 rounded-xl border border-border/80 bg-muted/30">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-text-secondary">Password Security Rating</span>
                    <span className="text-text-primary">{passwordStrength.label}</span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          idx < passwordStrength.score ? passwordStrength.color : 'bg-muted border border-border'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="space-y-1">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  {...register('terms')}
                  className="w-4 h-4 rounded border-border text-indigo-600 focus:ring-indigo-500 accent-indigo-500 mt-0.5"
                />
                <label htmlFor="terms" className="text-xs text-text-secondary font-medium select-none cursor-pointer leading-normal">
                  I accept the{' '}
                  <span className="text-indigo-500 font-bold hover:underline">Terms of Service</span> and{' '}
                  <span className="text-indigo-500 font-bold hover:underline">Privacy Policy</span>.
                </label>
              </div>
              {errors.terms && (
                <span className="text-[10px] text-red-500 font-semibold block">{errors.terms.message}</span>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-apple transition-colors flex items-center justify-center gap-2 text-xs"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center text-[10px] text-text-secondary/60">
          Already running an environment?{' '}
          <Link to="/login" className="text-indigo-500 font-bold hover:underline">
            Login
          </Link>
        </div>
      </div>

    </div>
  )
}
