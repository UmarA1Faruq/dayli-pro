import { cn } from '../utils/helpers'

const Line = ({ className }) => <div className={cn('skeleton h-3', className)} />

const CardBlock = ({ className, children }) => (
  <div className={cn('card p-5', className)}>{children}</div>
)

function HeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-3">
        <Line className="h-2.5 w-20" />
        <Line className="h-8 w-56 max-w-full rounded-xl" />
        <Line className="h-3.5 w-72 max-w-full" />
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-10 w-24 rounded-xl" />
        <div className="skeleton h-10 w-28 rounded-xl" />
      </div>
    </div>
  )
}

function StatsSkeleton({ count = 3 }) {
  return (
    <div className={cn('grid gap-4', count === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2')}>
      {Array.from({ length: count }).map((_, index) => (
        <CardBlock key={index} className="flex items-center gap-4">
          <div className="skeleton h-11 w-11 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Line className="w-24" />
            <Line className="h-5 w-16" />
          </div>
        </CardBlock>
      ))}
    </div>
  )
}

function ListSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
          <div className="skeleton h-5 w-5 rounded-md" />
          <div className="flex-1 space-y-2">
            <Line className={index % 2 ? 'w-2/3' : 'w-4/5'} />
            <Line className="h-2.5 w-24" />
          </div>
          <div className="skeleton h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export default function PageSkeleton({ pathname }) {
  if (pathname === '/dashboard') {
    return (
      <div className="space-y-5 sm:space-y-6">
        <HeaderSkeleton />
        <div className="card flex items-center gap-4 p-5">
          <div className="skeleton h-10 w-10 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Line className="w-full max-w-md" />
            <Line className="h-2.5 w-20" />
          </div>
        </div>
        <StatsSkeleton />
        <div className="grid gap-5 xl:grid-cols-3">
          <CardBlock className="xl:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div className="space-y-2">
                <Line className="h-4 w-32" />
                <Line className="h-2.5 w-48" />
              </div>
              <div className="skeleton h-8 w-20 rounded-lg" />
            </div>
            <ListSkeleton rows={4} />
          </CardBlock>
          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <CardBlock key={item} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="skeleton h-9 w-9 rounded-xl" />
                  <Line className="h-4 w-28" />
                </div>
                <Line className="h-6 w-24" />
                <div className="skeleton h-2.5 w-full rounded-full" />
              </CardBlock>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (pathname === '/journal') {
    return (
      <div className="space-y-6">
        <HeaderSkeleton />
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <CardBlock key={item} className="space-y-2">
              <Line className="h-2.5 w-20" />
              <Line className="h-6 w-10" />
            </CardBlock>
          ))}
        </div>
        <CardBlock className="flex flex-col gap-3 sm:flex-row">
          <div className="skeleton h-10 flex-1 rounded-xl" />
          <div className="skeleton h-10 w-32 rounded-xl" />
          <div className="skeleton h-10 w-32 rounded-xl" />
        </CardBlock>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <CardBlock key={item} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="skeleton h-7 w-16 rounded-full" />
                <div className="skeleton h-4 w-14" />
              </div>
              <Line className="h-5 w-3/4" />
              <div className="space-y-2">
                <Line className="w-full" />
                <Line className="w-5/6" />
                <Line className="w-2/3" />
              </div>
              <div className="flex gap-2">
                <div className="skeleton h-5 w-14 rounded-full" />
                <div className="skeleton h-5 w-16 rounded-full" />
              </div>
            </CardBlock>
          ))}
        </div>
      </div>
    )
  }

  if (pathname === '/habits') {
    return (
      <div className="space-y-6">
        <HeaderSkeleton />
        <div className="card flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Line className="h-3 w-24" />
            <Line className="h-8 w-40" />
            <Line className="h-2.5 w-52" />
          </div>
          <div className="flex gap-3">
            <div className="skeleton h-16 w-24 rounded-2xl" />
            <div className="skeleton h-16 w-24 rounded-2xl" />
          </div>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <CardBlock key={item} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="skeleton h-11 w-11 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Line className="h-4 w-40" />
                  <Line className="h-2.5 w-52" />
                </div>
              </div>
              <div className="flex justify-between gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div key={day} className="skeleton h-9 w-9 rounded-full" />
                ))}
              </div>
            </CardBlock>
          ))}
        </div>
      </div>
    )
  }

  if (pathname === '/calendar') {
    return (
      <div className="space-y-6">
        <HeaderSkeleton />
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <CardBlock className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="skeleton h-8 w-40 rounded-lg" />
              <div className="flex gap-2">
                <div className="skeleton h-8 w-8 rounded-lg" />
                <div className="skeleton h-8 w-8 rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 42 }).map((_, index) => (
                <div
                  key={index}
                  className="skeleton aspect-square min-h-[52px] rounded-xl sm:min-h-[78px]"
                />
              ))}
            </div>
          </CardBlock>
          <CardBlock className="space-y-4">
            <Line className="h-5 w-32" />
            <ListSkeleton rows={3} />
          </CardBlock>
        </div>
      </div>
    )
  }

  if (pathname === '/stats') {
    return (
      <div className="space-y-6">
        <HeaderSkeleton />
        <StatsSkeleton />
        <div className="grid gap-5 xl:grid-cols-3">
          <CardBlock className="space-y-4 xl:col-span-2">
            <Line className="h-4 w-36" />
            <div className="skeleton h-[260px] w-full rounded-2xl" />
          </CardBlock>
          <CardBlock className="space-y-4">
            <Line className="h-4 w-32" />
            <div className="skeleton mx-auto h-44 w-44 rounded-full" />
            <div className="space-y-2">
              <Line className="w-full" />
              <Line className="w-4/5" />
            </div>
          </CardBlock>
        </div>
      </div>
    )
  }

  if (pathname === '/settings') {
    return (
      <div className="space-y-6">
        <HeaderSkeleton />
        <div className="grid gap-5 xl:grid-cols-3">
          <CardBlock className="space-y-4 xl:col-span-2">
            <Line className="h-4 w-32" />
            <div className="flex items-center gap-4">
              <div className="skeleton h-16 w-16 rounded-full" />
              <div className="flex-1 space-y-2">
                <Line className="w-40" />
                <Line className="h-2.5 w-52" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="skeleton h-10 rounded-xl" />
              <div className="skeleton h-10 rounded-xl" />
            </div>
            <div className="skeleton h-20 rounded-xl" />
          </CardBlock>
          <div className="space-y-5">
            <CardBlock className="space-y-4">
              <Line className="h-4 w-28" />
              <div className="skeleton h-14 rounded-xl" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="skeleton h-8 w-8 rounded-full" />
                ))}
              </div>
            </CardBlock>
            <CardBlock className="space-y-4">
              <Line className="h-4 w-28" />
              <div className="skeleton h-10 rounded-xl" />
            </CardBlock>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <HeaderSkeleton />
      <StatsSkeleton />
      <CardBlock className="space-y-4">
        <div className="flex items-center justify-between">
          <Line className="h-5 w-32" />
          <div className="skeleton h-8 w-24 rounded-lg" />
        </div>
        <ListSkeleton rows={5} />
      </CardBlock>
    </div>
  )
}
