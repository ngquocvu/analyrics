export default function BuyMeACoffee() {
    return (
        <div className="relative group">
            {/* Glow effect on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/50 via-orange-500/50 to-yellow-500/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />

            <a
                href="https://www.buymeacoffee.com/quocvu"
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-amber-100/10 via-orange-100/10 to-yellow-100/10 hover:from-amber-100/20 hover:via-orange-100/20 hover:to-yellow-100/20 backdrop-blur-xl border border-amber-200/30 hover:border-amber-200/60 rounded-2xl transition-all duration-500 shadow-2xl hover:shadow-amber-500/20 group-hover:scale-105"
            >
                {/* Coffee Cup Icon with Steam */}
                <div className="relative">
                    <div className="text-3xl transform group-hover:rotate-12 transition-transform duration-300">
                        ☕
                    </div>
                    {/* Animated steam */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-0.5">
                        <div className="w-0.5 h-3 bg-white/40 rounded-full animate-steam opacity-0 group-hover:opacity-100 transition-opacity" style={{ animationDelay: '0s' }} />
                        <div className="w-0.5 h-3 bg-white/40 rounded-full animate-steam opacity-0 group-hover:opacity-100 transition-opacity" style={{ animationDelay: '0.2s' }} />
                        <div className="w-0.5 h-3 bg-white/40 rounded-full animate-steam opacity-0 group-hover:opacity-100 transition-opacity" style={{ animationDelay: '0.4s' }} />
                    </div>
                </div>

                <div className="flex flex-col">
                    <span className="text-white font-bold text-lg tracking-wide">
                        Buy me a coffee
                    </span>
                    <span className="text-white/60 text-xs font-medium">
                        Support my work ✨
                    </span>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out" />
                </div>
            </a>
        </div>
    );
}
