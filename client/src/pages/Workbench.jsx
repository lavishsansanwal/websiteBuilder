import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BarChart3, BrushCleaning, Check, Copy, Layers, LayoutTemplate, Menu, Monitor, Play, Sparkles, UploadCloud, WandSparkles } from 'lucide-react'

function Workbench() {
    const navigate = useNavigate()

    const operations = [
        { title: 'Website brief', subtitle: 'Beauty studio launch', progress: 96, tone: 'from-emerald-500/30 to-emerald-500/5', icon: LayoutTemplate },
        { title: 'Brand direction', subtitle: 'Warm, premium and concise', progress: 78, tone: 'from-sky-500/30 to-sky-500/5', icon: Sparkles },
        { title: 'Page stack', subtitle: 'Home, services, pricing', progress: 88, tone: 'from-violet-500/30 to-violet-500/5', icon: Layers }
    ]

    return (
        <div className='min-h-screen bg-[#050505] text-white'>
            <header className='sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10'>
                <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <button className='p-2 rounded-lg hover:bg-white/10 transition' onClick={() => navigate('/dashboard')}>
                            <ArrowLeft size={16} />
                        </button>
                        <div>
                            <p className='text-[11px] uppercase tracking-[0.24em] text-zinc-500'>Workspace</p>
                            <h1 className='text-lg font-semibold'>Workbench</h1>
                        </div>
                    </div>

                    <div className='flex items-center gap-3'>
                        <button className='px-4 py-2 rounded-xl border border-white/10 text-sm hover:bg-white/10'>Save draft</button>
                        <button className='px-4 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:scale-105 transition'>Publish</button>
                    </div>
                </div>
            </header>

            <main className='max-w-7xl mx-auto px-6 py-8'>
                <section className='grid grid-cols-1 lg:grid-cols-[1.08fr,0.92fr] gap-6'>
                    <div className='rounded-3xl border border-white/10 bg-white/[0.06] p-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-xs uppercase tracking-[0.22em] text-zinc-500'>Current project</p>
                                <h2 className='mt-2 text-3xl font-bold'>Studio Launch</h2>
                            </div>
                            <div className='flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs'>
                                <Sparkles size={14} /> Live draft
                            </div>
                        </div>

                        <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-4'>
                            {operations.map((item, index) => {
                                const Icon = item.icon
                                return (
                                    <div key={item.title} className='rounded-2xl border border-white/10 bg-black/30 p-4'>
                                        <div className='flex items-center justify-between'>
                                            <span className='p-2 rounded-xl bg-white/8'><Icon size={16} /></span>
                                            <span className='text-[11px] text-zinc-500'>{item.progress}%</span>
                                        </div>
                                        <h3 className='mt-7 text-sm font-semibold'>{item.title}</h3>
                                        <p className='mt-2 text-xs text-zinc-500'>{item.subtitle}</p>
                                        <div className='mt-4 h-2 rounded-full bg-white/8 overflow-hidden'>
                                            <div className='h-full rounded-full bg-gradient-to-r from-white to-zinc-500' style={{ width: `${item.progress}%` }}></div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className='mt-6 p-4 rounded-2xl border border-white/10 bg-black/30'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className='text-xs uppercase tracking-[0.2em] text-zinc-500'>Prompt console</p>
                                    <h3 className='mt-2 text-lg font-semibold'>Improve the homepage headline</h3>
                                </div>
                                <button className='flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-sm font-semibold'>
                                    <Sparkles size={14} /> Run AI
                                </button>
                            </div>
                            <div className='mt-4 flex gap-2'>
                                <div className='flex-1 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-zinc-300'>Create a more premium CTA and add a stronger value proposition.</div>
                                <button className='px-3 rounded-xl border border-white/10 hover:bg-white/10'><Copy size={15} /></button>
                            </div>
                        </div>
                    </div>

                    <aside className='rounded-3xl border border-white/10 bg-white/[0.05] p-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-xs uppercase tracking-[0.22em] text-zinc-500'>Completion</p>
                                <h2 className='text-2xl font-bold mt-2'>Build health</h2>
                            </div>
                            <span className='px-3 py-2 rounded-xl bg-emerald-500/15 text-emerald-300 text-xs border border-emerald-500/30'>Healthy</span>
                        </div>

                        <div className='mt-8 space-y-4'>
                            <div className='flex items-center justify-between'>
                                <span className='text-sm text-zinc-400'>Page coverage</span>
                                <span className='text-sm font-semibold'>3 / 4</span>
                            </div>
                            <div className='h-2 bg-white/8 rounded-full overflow-hidden'>
                                <div className='h-full rounded-full bg-white w-[75%]'></div>
                            </div>

                            <div className='flex items-center justify-between'>
                                <span className='text-sm text-zinc-400'>SEO readiness</span>
                                <span className='text-sm font-semibold'>Good</span>
                            </div>
                            <div className='h-2 bg-white/8 rounded-full overflow-hidden'>
                                <div className='h-full rounded-full bg-emerald-400 w-[88%]'></div>
                            </div>

                            <div className='flex items-center justify-between'>
                                <span className='text-sm text-zinc-400'>Accessibility scan</span>
                                <span className='text-sm font-semibold'>2 issues</span>
                            </div>
                            <div className='h-2 bg-white/8 rounded-full overflow-hidden'>
                                <div className='h-full rounded-full bg-amber-300 w-[54%]'></div>
                            </div>
                        </div>

                        <div className='mt-10 grid grid-cols-2 gap-3'>
                            <button className='rounded-2xl border border-white/10 p-4 hover:bg-white/8 text-left'>
                                <LayoutTemplate size={20} className='mb-4' />
                                <div className='text-sm font-semibold'>Pages</div>
                                <div className='text-[11px] text-zinc-500 mt-1'>Edit structure</div>
                            </button>
                            <button className='rounded-2xl border border-white/10 p-4 hover:bg-white/8 text-left'>
                                <UploadCloud size={20} className='mb-4' />
                                <div className='text-sm font-semibold'>Assets</div>
                                <div className='text-[11px] text-zinc-500 mt-1'>Images & media</div>
                            </button>
                            <button className='rounded-2xl border border-white/10 p-4 hover:bg-white/8 text-left'>
                                <Monitor size={20} className='mb-4' />
                                <div className='text-sm font-semibold'>Preview</div>
                                <div className='text-[11px] text-zinc-500 mt-1'>Live site</div>
                            </button>
                            <button className='rounded-2xl border border-white/10 p-4 hover:bg-white/8 text-left'>
                                <BarChart3 size={20} className='mb-4' />
                                <div className='text-sm font-semibold'>Analytics</div>
                                <div className='text-[11px] text-zinc-500 mt-1'>Visit insights</div>
                            </button>
                        </div>
                    </aside>
                </section>

                <section className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='rounded-2xl border border-white/10 bg-white/[0.04] p-4'>
                        <div className='flex items-center gap-2'>
                            <Sparkles size={16} className='text-zinc-300' />
                            <span className='text-sm font-semibold'>Style system</span>
                        </div>
                        <div className='mt-4 flex gap-2'>
                            <span className='w-7 h-7 rounded-full bg-white border border-white/10'></span>
                            <span className='w-7 h-7 rounded-full bg-zinc-700'></span>
                            <span className='w-7 h-7 rounded-full bg-amber-300'></span>
                        </div>
                    </div>

                    <div className='rounded-2xl border border-white/10 bg-white/[0.04] p-4'>
                        <div className='flex items-center gap-2'>
                            <Check size={16} className='text-emerald-300' />
                            <span className='text-sm font-semibold'>Quality checks</span>
                        </div>
                        <div className='mt-4 text-sm text-zinc-400'>Responsive layout ready</div>
                    </div>

                    <div className='rounded-2xl border border-white/10 bg-white/[0.04] p-4'>
                        <div className='flex items-center gap-2'>
                            <Play size={16} className='text-zinc-300' />
                            <span className='text-sm font-semibold'>Next action</span>
                        </div>
                        <button className='mt-4 w-full px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-semibold'>Deploy preview</button>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Workbench
