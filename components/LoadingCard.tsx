export default function LoadingCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      <div className="h-1 w-full shimmer-bg" />
      <div className="glass p-6 space-y-4">
        {/* Badge + name skeleton */}
        <div className="space-y-3">
          <div className="h-5 w-24 rounded-full shimmer-bg" />
          <div className="h-10 w-48 rounded-lg shimmer-bg" />
        </div>
        {/* Origin pill */}
        <div className="h-6 w-32 rounded-full shimmer-bg" />
        {/* Meaning lines */}
        <div className="space-y-2 pt-2">
          <div className="h-3 w-16 rounded shimmer-bg" />
          <div className="h-4 w-full rounded shimmer-bg" />
          <div className="h-4 w-4/5 rounded shimmer-bg" />
        </div>
        {/* Etymology lines */}
        <div className="space-y-2 pt-2">
          <div className="h-3 w-20 rounded shimmer-bg" />
          <div className="h-4 w-full rounded shimmer-bg" />
          <div className="h-4 w-3/4 rounded shimmer-bg" />
          <div className="h-4 w-5/6 rounded shimmer-bg" />
        </div>
        {/* Two column */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <div className="h-3 w-24 rounded shimmer-bg" />
            <div className="flex flex-wrap gap-2">
              {[60, 80, 70].map((w) => (
                <div key={w} className="h-6 rounded-full shimmer-bg" style={{ width: w }} />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-28 rounded shimmer-bg" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 rounded shimmer-bg" style={{ width: `${70 + i * 5}%` }} />
            ))}
          </div>
        </div>
        {/* Fun fact */}
        <div className="h-16 rounded-xl shimmer-bg" />
      </div>
    </div>
  );
}
