export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-4 border-[#ff4444]/20 border-t-[#ff4444] rounded-full animate-spin" />
        <p className="text-[#aaaaaa] text-sm">Loading...</p>
      </div>
    </div>
  )
}
