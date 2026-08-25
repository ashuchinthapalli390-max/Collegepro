import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react'

export const VerifyEmail: React.FC = () => {
  const navigate = useNavigate()
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [resendTimer, setResendTimer] = useState(59)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const inputRefs = useRef<HTMLInputElement[]>([])

  // Resend Timer countdown
  useEffect(() => {
    if (resendTimer <= 0) return
    const id = setInterval(() => {
      setResendTimer((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(id)
  }, [resendTimer])

  const handleOtpChange = (value: string, index: number) => {
    // Only accept numeric inputs
    if (isNaN(Number(value))) return

    const newOtp = [...otp]
    // Grab the last character (handles pasting or overwrite)
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Shift focus forward if value added
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto trigger verify if full
    if (newOtp.join('').length === 6) {
      triggerVerify(newOtp.join(''))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Shfit focus backward if backspace pressed on empty input
      inputRefs.current[index - 1]?.focus()
    }
  }

  const triggerVerify = async (code: string) => {
    setIsVerifying(true)
    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsVerifying(false)
    setIsSuccess(true)

    // Delay navigation to show success animation
    setTimeout(() => {
      navigate('/welcome')
    }, 1000)
  }

  const handleResend = () => {
    setResendTimer(59)
    // Mock dispatch
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 select-none">
      
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel p-8 rounded-3xl border border-border shadow-apple-floating relative text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl">
            <ShieldCheck className="w-8 h-8 text-indigo-500 animate-bounce" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="otp-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-black text-text-primary tracking-tight">Security Check</h3>
                <p className="text-xs text-text-secondary leading-relaxed font-medium">
                  We have dispatched a six-digit verification code to your workspace. Enter it below to unlock the environment.
                </p>
              </div>

              {/* OTP Boxes */}
              <div className="flex justify-center gap-2 sm:gap-3 py-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    ref={(el) => { inputRefs.current[idx] = el as HTMLInputElement }}
                    className="w-11 h-12 text-center text-lg font-bold border border-border focus:border-indigo-500 bg-muted/30 focus:bg-surface rounded-xl focus:outline-none transition-all text-text-primary"
                  />
                ))}
              </div>

              {isVerifying && (
                <div className="flex justify-center items-center gap-2 text-xs font-semibold text-text-secondary">
                  <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span>Decrypting environment signatures...</span>
                </div>
              )}

              {/* Resend Actions */}
              <div className="text-xs text-text-secondary font-medium">
                {resendTimer > 0 ? (
                  <span>Resend security code in <span className="font-bold text-text-primary">{resendTimer}s</span></span>
                ) : (
                  <button onClick={handleResend} className="text-indigo-500 font-bold hover:underline">
                    Resend code
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="otp-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-black text-text-primary tracking-tight">Decryption Verified</h3>
                <p className="text-xs text-text-secondary leading-relaxed font-medium">
                  Identity matching successful. Setting up onboarding workflow.
                </p>
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 border border-emerald-100 dark:border-emerald-950/30">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>Workspace Access Key Decrypted.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  )
}
