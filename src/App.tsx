import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  AirVent,
  ArrowLeft,
  ArrowRight,
  Bath,
  CalendarDays,
  Car,
  Cctv,
  Check,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  CookingPot,
  Fan,
  Flag,
  Globe,
  Heart,
  House,
  Images,
  KeyRound,
  Laptop,
  LayoutGrid,
  Menu,
  Minus,
  PawPrint,
  Plus,
  Search,
  Share,
  Shield,
  Siren,
  Sparkles,
  Star,
  Sun,
  Trees,
  Tv,
  Waves,
  Wifi,
  X,
} from 'lucide-react'
import { blockedDates, property } from './data/property'

type Overlay = 'tour' | 'lightbox' | 'amenities' | 'reviews' | null
type SectionId = 'photos' | 'amenities' | 'reviews' | 'location'

const INR = new Intl.NumberFormat('en-IN')
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function parseISO(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function toISO(date: Date) {
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function nightsBetween(start: string, end: string) {
  return Math.max(1, Math.round((parseISO(end).getTime() - parseISO(start).getTime()) / 86400000))
}

function formatShort(value: string) {
  return parseISO(value).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
}

function formatLong(value: string) {
  return parseISO(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function amenityIcon(icon: string, missing?: boolean) {
  const common = { size: 24, strokeWidth: 1.6 }
  const node =
    icon === 'kitchen' ? <CookingPot {...common} /> :
    icon === 'wifi' ? <Wifi {...common} /> :
    icon === 'workspace' ? <Laptop {...common} /> :
    icon === 'parking' ? <Car {...common} /> :
    icon === 'pool' ? <Waves {...common} /> :
    icon === 'hottub' ? <Bath {...common} /> :
    icon === 'pets' ? <PawPrint {...common} /> :
    icon === 'camera' ? <Cctv {...common} /> :
    icon === 'co' ? <Siren {...common} /> :
    icon === 'smoke' ? <AirVent {...common} /> :
    <House {...common} />
  return missing ? <span className="missing-icon">{node}</span> : node
}

export function App() {
  const [saved, setSaved] = useState(false)
  const [overlay, setOverlay] = useState<Overlay>(() => {
    const hash = window.location.hash
    if (hash === '#tour') return 'tour'
    if (hash.startsWith('#lightbox')) return 'lightbox'
    return null
  })
  const [activeImage, setActiveImage] = useState(() => {
    const match = /^#lightbox-(\d+)$/.exec(window.location.hash)
    return match ? Number(match[1]) : 0
  })
  const [checkIn, setCheckIn] = useState(property.checkIn)
  const [checkOut, setCheckOut] = useState(property.checkOut)
  const [guests, setGuests] = useState(property.defaultGuests)
  const [guestOpen, setGuestOpen] = useState(false)
  const [descOpen, setDescOpen] = useState(false)
  const [original, setOriginal] = useState(false)
  const [claimed, setClaimed] = useState(false)
  const [nearbyPage, setNearbyPage] = useState(0)
  const [activeSection, setActiveSection] = useState<SectionId>('photos')
  const [showSticky, setShowSticky] = useState(false)
  const lastFocused = useRef<HTMLElement | null>(null)

  const nights = nightsBetween(checkIn, checkOut)
  const total = Math.round((property.totalPrice / property.nights) * nights)
  const allImages = useMemo(
    () => property.tour.flatMap((section) => section.images),
    [],
  )

  const openOverlay = (next: Overlay, index = 0) => {
    lastFocused.current = document.activeElement as HTMLElement
    setActiveImage(index)
    setOverlay(next)
  }

  const closeOverlay = () => {
    setOverlay(null)
    window.setTimeout(() => lastFocused.current?.focus(), 0)
  }

  useEffect(() => {
    if (!overlay) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeOverlay()
      if (overlay === 'lightbox' && event.key === 'ArrowRight') setActiveImage((index) => (index + 1) % allImages.length)
      if (overlay === 'lightbox' && event.key === 'ArrowLeft') setActiveImage((index) => (index - 1 + allImages.length) % allImages.length)
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [overlay, allImages.length])

  useEffect(() => {
    const ids: SectionId[] = ['photos', 'amenities', 'reviews', 'location']
    const onScroll = () => {
      setShowSticky(window.scrollY > 520)
      const marker = window.scrollY + 140
      let current: SectionId = 'photos'
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= marker) current = id
      }
      setActiveSection(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: SectionId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const shareListing = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: property.title, url })
        return
      } catch {
        /* fall through */
      }
    }
    await navigator.clipboard.writeText(url)
  }

  return (
    <>
      <Header />
      {showSticky && (
        <StickyNav
          active={activeSection}
          onJump={scrollTo}
          nights={nights}
          total={total}
          onReserve={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
        />
      )}

      <main className="page-shell">
        <section className="listing-heading" id="photos">
          <h1>{property.title}</h1>
          <div className="heading-actions">
            <button className="text-action" onClick={shareListing}><Share size={16} /> Share</button>
            <button className={`text-action ${saved ? 'active' : ''}`} onClick={() => setSaved(!saved)}>
              <Heart size={16} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save'}
            </button>
          </div>
        </section>

        <section className="gallery" aria-label="Property photos">
          {property.images.slice(0, 5).map((image, index) => (
            <button key={image.src} className={`gallery-image image-${index + 1}`} onClick={() => openOverlay('tour', index)}>
              <img src={image.src} alt={image.alt} />
            </button>
          ))}
          <button className="show-all" onClick={() => openOverlay('tour')}>
            <LayoutGrid size={15} /> Show all photos
          </button>
        </section>

        <p className="listing-kicker">{property.type}</p>
        <p className="listing-meta">{property.guests} guests · {property.bedrooms} bedroom · {property.beds} bed · {property.bathrooms} bathroom</p>

        <div className="content-grid">
          <div className="main-column">
            <section className="guest-fav-row">
              <div className="guest-fav-card">
                <div className="guest-fav-copy">
                  <Laurel />
                  <div>
                    <strong>Guest favourite</strong>
                    <p>One of the most loved homes on Airbnb, according to guests</p>
                  </div>
                </div>
                <div className="guest-stats">
                  <div>
                    <b>{property.rating.toFixed(2)}</b>
                    <span className="mini-stars">★★★★★</span>
                  </div>
                  <span className="stat-split" />
                  <button className="link-button" onClick={() => scrollTo('reviews')}>{property.reviewsCount} Reviews</button>
                </div>
              </div>
            </section>

            <section className="hosted-row">
              <div className="host-avatar">M</div>
              <div>
                <strong>Hosted by {property.host.name}</strong>
                <p>{property.host.years} years hosting</p>
              </div>
            </section>

            <section className="highlights section">
              {property.highlights.map((item) => (
                <Highlight
                  key={item.key}
                  icon={item.key === 'outdoor' ? <Trees /> : item.key === 'cool' ? <Fan /> : <KeyRound />}
                  title={item.title}
                  text={item.text}
                />
              ))}
            </section>

            <section className="section description">
              <p className="translated">Some info has been automatically translated. <button className="link-button" onClick={() => setOriginal(!original)}>{original ? 'Show translation' : 'Show original'}</button></p>
              <p>{original ? 'Plan Your Relaxing Holiday at Amor De Goa by Mirashya Homes! Stay in this cozy 1BHK in the heart of Candolim, featuring a private jacuzzi for the perfect unwind.' : property.description}</p>
              {descOpen && <p>{property.descriptionMore}</p>}
              <button className="underlined" onClick={() => setDescOpen(!descOpen)}>Show {descOpen ? 'less' : 'more'} <ChevronRight size={15} /></button>
            </section>

            <section className="section" id="amenities">
              <h2>Where you'll sleep</h2>
              <div className="sleep-grid">
                {property.sleep.map((room) => (
                  <button key={room.title} className="sleep-photo" onClick={() => openOverlay('tour')}>
                    <img src={room.src} alt={room.alt} />
                    <strong>{room.title}</strong>
                    <span>{room.detail}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="section amenities">
              <h2>What this place offers</h2>
              <div className="amenity-grid">
                {property.amenities.map((amenity) => (
                  <div key={amenity.name} className={amenity.missing ? 'missing' : ''}>
                    {amenityIcon(amenity.icon, amenity.missing)}
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
              <button className="outline-button" onClick={() => openOverlay('amenities')}>Show all {property.allAmenities.length} amenities</button>
            </section>

            <StayCalendar checkIn={checkIn} checkOut={checkOut} onChange={(start, end) => { setCheckIn(start); setCheckOut(end) }} />
          </div>

          <div className="booking-column" id="booking">
            <div className="promo-card">
              <Sparkles size={18} />
              <div>
                <strong>Get 10% off your next stay.</strong>
                <button className="link-button" type="button">Terms apply</button>
              </div>
              <button className="claim-button" onClick={() => setClaimed(true)}>{claimed ? 'Claimed' : 'Claim'}</button>
            </div>

            <ReservationCard
              nights={nights}
              total={total}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              guestOpen={guestOpen}
              onToggleGuests={() => setGuestOpen(!guestOpen)}
              onGuests={setGuests}
            />
            <button className="report-link"><Flag size={13} /> Report this listing</button>
          </div>
        </div>

        <Reviews onShowAll={() => openOverlay('reviews')} />

        <section className="section location-section" id="location">
          <h2>Where you'll be</h2>
          <p className="muted">{property.location}</p>
          <PrivacyMap />
          <p className="exact-note">Exact location will be provided after booking.</p>
          <h3>Neighbourhood highlights</h3>
          <p>{property.neighbourhood}</p>
          <button className="underlined">Show more <ChevronRight size={15} /></button>
        </section>

        <HostSection />

        <section className="section things">
          <h2>Things to know</h2>
          <div className="things-grid">
            <div>
              <CalendarDays size={20} />
              <h3>Cancellation policy</h3>
              <p>{property.cancellation}</p>
              <button className="underlined">Learn more</button>
            </div>
            <div>
              <House size={20} />
              <h3>House rules</h3>
              {property.houseRules.map((rule) => <p key={rule}>{rule}</p>)}
              <button className="underlined">Learn more</button>
            </div>
            <div>
              <Shield size={20} />
              <h3>Safety & property</h3>
              {property.safety.map((rule) => <p key={rule}>{rule}</p>)}
              <button className="underlined">Learn more</button>
            </div>
          </div>
        </section>

        <section className="nearby-section">
          <div className="nearby-head">
            <h2>More stays nearby</h2>
            <div className="nearby-nav">
              <span>{nearbyPage + 1} / 2</span>
              <button className="round-nav" disabled={nearbyPage === 0} onClick={() => setNearbyPage(0)} aria-label="Previous stays"><ArrowLeft size={16} /></button>
              <button className="round-nav" disabled={nearbyPage === 1} onClick={() => setNearbyPage(1)} aria-label="Next stays"><ArrowRight size={16} /></button>
            </div>
          </div>
          <div className="nearby-grid">
            {property.nearby.slice(nearbyPage * 5, nearbyPage * 5 + 5).map((stay) => (
              <article key={stay.title}>
                <img src={stay.src} alt="" />
                <strong>{stay.title}</strong>
                <span>₹{INR.format(stay.price)} · ★ {stay.rating}</span>
              </article>
            ))}
          </div>
        </section>
      </main>

      {overlay === 'tour' && (
        <PhotoTour
          onClose={closeOverlay}
          startIndex={activeImage}
          saved={saved}
          onSave={() => setSaved(!saved)}
          onShare={shareListing}
          onOpenLightbox={(src) => {
            const index = allImages.findIndex((image) => image.src === src)
            setActiveImage(index >= 0 ? index : 0)
            setOverlay('lightbox')
          }}
        />
      )}
      {overlay === 'lightbox' && (
        <Lightbox
          index={activeImage}
          images={allImages}
          onClose={() => setOverlay('tour')}
          onNext={() => setActiveImage((activeImage + 1) % allImages.length)}
          onPrevious={() => setActiveImage((activeImage - 1 + allImages.length) % allImages.length)}
        />
      )}
      {overlay === 'amenities' && <SimpleModal title="What this place offers" onClose={closeOverlay}><ul className="modal-list">{property.allAmenities.map((item) => <li key={item}>{item}</li>)}</ul></SimpleModal>}
      {overlay === 'reviews' && (
        <SimpleModal title={`${property.reviewsCount} reviews`} onClose={closeOverlay}>
          <div className="modal-reviews">
            {property.reviews.map((review) => (
              <article key={review.name}>
                <strong>{review.name}</strong>
                <p className="muted">{review.tenure} · {review.date}</p>
                <p>{review.text}</p>
              </article>
            ))}
          </div>
        </SimpleModal>
      )}
    </>
  )
}

function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#photos" aria-label="Airbnb home">
          <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 2.5c-1.2 0-2.2.7-2.9 2L3.8 23.7c-1.6 3.1.3 6.8 3.7 6.8 1.8 0 3.5-1 4.4-2.6L16 18.2l4.1 9.7c.9 1.6 2.6 2.6 4.4 2.6 3.4 0 5.3-3.7 3.7-6.8L18.9 4.5c-.7-1.3-1.7-2-2.9-2Z" /><path d="M16 18.2c-2.5-4.7-5.4-7.1-7.1-4.1-1.1 2 .2 4.4 2.6 4.4h9c2.4 0 3.7-2.4 2.6-4.4-1.7-3-4.6-.6-7.1 4.1Z" /></svg>
          <span>airbnb</span>
        </a>
        <button className={`search-pill ${searchOpen ? 'search-active' : ''}`} onClick={() => setSearchOpen(!searchOpen)} aria-expanded={searchOpen}>
          <span>Anywhere</span>
          <span className="divider" />
          <span>Anytime</span>
          <span className="divider" />
          <span className="muted-pill">Add guests</span>
          <span className="search-icon"><Search size={14} /></span>
        </button>
        <div className="header-right">
          <button className="host-link">Become a host</button>
          <button className="icon-button" aria-label="Choose language"><Globe size={16} /></button>
          <button className="profile-menu" aria-label="Open account menu"><Menu size={16} /><CircleUserRound size={30} strokeWidth={1.4} /></button>
        </div>
      </div>
    </header>
  )
}

function StickyNav({ active, onJump, nights, total, onReserve }: { active: SectionId; onJump: (id: SectionId) => void; nights: number; total: number; onReserve: () => void }) {
  return (
    <div className="sticky-listing-nav">
      <div className="sticky-inner">
        <nav>
          {(['photos', 'amenities', 'reviews', 'location'] as const).map((id) => (
            <button key={id} className={active === id ? 'active' : ''} onClick={() => onJump(id)}>{id[0].toUpperCase() + id.slice(1)}</button>
          ))}
        </nav>
        <div className="sticky-reserve">
          <div>
            <strong>₹{INR.format(total)}</strong> <span>for {nights} nights</span>
            <p>★ {property.rating} · {property.reviewsCount} reviews</p>
          </div>
          <button className="reserve-button compact" onClick={onReserve}>Reserve</button>
        </div>
      </div>
    </div>
  )
}

function Highlight({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <div className="highlight"><span>{icon}</span><div><strong>{title}</strong><p>{text}</p></div></div>
}

function Laurel() {
  return (
    <span className="laurel" aria-hidden="true">
      <svg viewBox="0 0 32 48" width="22" height="34"><path fill="currentColor" d="M22 46c-6-4-10-14-10-22 0-9 4-18 10-22-5 2-14 10-14 22s8 20 14 22Z" /></svg>
    </span>
  )
}

function ReservationCard({
  nights, total, checkIn, checkOut, guests, guestOpen, onToggleGuests, onGuests,
}: {
  nights: number
  total: number
  checkIn: string
  checkOut: string
  guests: number
  guestOpen: boolean
  onToggleGuests: () => void
  onGuests: (value: number) => void
}) {
  return (
    <aside className="reservation-card">
      <div className="price-line"><strong>₹{INR.format(total)}</strong> <span>for {nights} nights</span></div>
      <div className="date-box">
        <div><label>CHECK-IN</label><strong>{formatShort(checkIn)}</strong></div>
        <div><label>CHECKOUT</label><strong>{formatShort(checkOut)}</strong></div>
      </div>
      <button className="guest-box" onClick={onToggleGuests} type="button">
        <label>GUESTS</label>
        <strong>{guests === 1 ? '1 guest' : `${guests} guests`}</strong>
        <ChevronDown size={16} />
      </button>
      {guestOpen && (
        <div className="guest-pop">
          <span>Adults</span>
          <div>
            <button type="button" disabled={guests <= 1} onClick={() => onGuests(guests - 1)} aria-label="Decrease guests"><Minus size={14} /></button>
            <b>{guests}</b>
            <button type="button" disabled={guests >= property.guests} onClick={() => onGuests(guests + 1)} aria-label="Increase guests"><Plus size={14} /></button>
          </div>
        </div>
      )}
      <p className="cancel-chip">Free cancellation before 17 October</p>
      <button className="reserve-button">Reserve</button>
      <p className="no-charge">You won't be charged yet</p>
    </aside>
  )
}

function StayCalendar({ checkIn, checkOut, onChange }: { checkIn: string; checkOut: string; onChange: (start: string, end: string) => void }) {
  const [cursor, setCursor] = useState(new Date(2026, 9, 1))
  const [picking, setPicking] = useState<'start' | 'end'>('start')
  const left = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
  const right = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)

  const selectDay = (iso: string) => {
    if (blockedDates.has(iso)) return
    if (picking === 'start' || iso <= checkIn) {
      onChange(iso, toISO(new Date(parseISO(iso).getTime() + 5 * 86400000)))
      setPicking('end')
      return
    }
    onChange(checkIn, iso)
    setPicking('start')
  }

  return (
    <section className="section calendar-section">
      <h2>{nightsBetween(checkIn, checkOut)} nights in Candolim</h2>
      <p className="muted">{formatLong(checkIn)} - {formatLong(checkOut)}</p>
      <div className="cal-head">
        <button className="round-nav" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} aria-label="Previous month"><ArrowLeft size={16} /></button>
        <MonthGrid date={left} checkIn={checkIn} checkOut={checkOut} onSelect={selectDay} />
        <MonthGrid date={right} checkIn={checkIn} checkOut={checkOut} onSelect={selectDay} />
        <button className="round-nav" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} aria-label="Next month"><ArrowRight size={16} /></button>
      </div>
      <div className="cal-footer">
        <span className="keyboard-hint" />
        <button className="link-button" onClick={() => onChange(property.checkIn, property.checkOut)}>Clear dates</button>
      </div>
    </section>
  )
}

function MonthGrid({ date, checkIn, checkOut, onSelect }: { date: Date; checkIn: string; checkOut: string; onSelect: (iso: string) => void }) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const days = new Date(year, month + 1, 0).getDate()
  const cells = [...Array(firstWeekday).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
  const start = parseISO(checkIn)
  const end = parseISO(checkOut)

  return (
    <div className="month">
      <h3>{date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
      <div className="dow">{WEEKDAYS.map((d, i) => <span key={`${d}${i}`}>{d}</span>)}</div>
      <div className="days">
        {cells.map((day, index) => {
          if (!day) return <span key={`e${index}`} />
          const iso = toISO(new Date(year, month, day))
          const current = new Date(year, month, day)
          const blocked = blockedDates.has(iso)
          const inRange = current > start && current < end
          const isStart = iso === checkIn
          const isEnd = iso === checkOut
          return (
            <button
              key={iso}
              type="button"
              disabled={blocked}
              className={`day ${blocked ? 'blocked' : ''} ${inRange ? 'in-range' : ''} ${isStart ? 'start' : ''} ${isEnd ? 'end' : ''}`}
              onClick={() => onSelect(iso)}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Reviews({ onShowAll }: { onShowAll: () => void }) {
  return (
    <section className="section reviews-section" id="reviews">
      <div className="review-hero">
        <span className="laurel large">❦</span>
        <div className="score">{property.rating.toFixed(2)}</div>
        <span className="laurel large flip">❦</span>
      </div>
      <h2>Guest favourite</h2>
      <p className="review-sub">This home is a guest favourite based on ratings, reviews and reliability</p>
      <button className="link-button center-link">How reviews work</button>
      <div className="rating-row">
        <div className="overall-bars">
          <strong>Overall rating</strong>
          {[5, 4, 3, 2, 1].map((n) => (
            <div key={n} className="bar-line"><span>{n}</span><i><b style={{ width: n === 5 ? '92%' : '6%' }} /></i></div>
          ))}
        </div>
        {property.categoryRatings.map((item, index) => (
          <div key={item.name} className="cat-score">
            <span>{item.name}</span>
            <b>{item.score.toFixed(1)}</b>
            {index === 0 ? <Sparkles size={22} /> : index === 1 ? <Check size={22} /> : index === 2 ? <KeyRound size={22} /> : index === 3 ? <Tv size={22} /> : index === 4 ? <House size={22} /> : <Sun size={22} />}
          </div>
        ))}
      </div>
      <div className="review-tags">
        {property.reviewTags.map((tag) => (
          <span key={tag.name}>{tag.name} {tag.count}</span>
        ))}
      </div>
      <div className="review-grid">
        {property.reviews.slice(0, 6).map((review) => (
          <article key={review.name}>
            <div className="reviewer">
              <span className="avatar-circle">{review.name[0]}</span>
              <div>
                <strong>{review.name}</strong>
                <p>{review.tenure}</p>
              </div>
            </div>
            <p className="stars-date">★★★★★ · {review.date}</p>
            <p>{review.text.length > 180 ? `${review.text.slice(0, 180)}...` : review.text}</p>
            {review.text.length > 180 && <button className="underlined">Show more</button>}
          </article>
        ))}
      </div>
      <button className="outline-button" onClick={onShowAll}>Show all {property.reviewsCount} reviews</button>
    </section>
  )
}

function PrivacyMap() {
  return (
    <div className="privacy-map" aria-label="Approximate map of Candolim">
      <div className="map-sea" />
      <div className="map-land" />
      <span className="map-blob a" />
      <span className="map-blob b" />
      <button className="map-zoom" aria-label="Zoom map">+</button>
      <button className="map-zoom minus" aria-label="Zoom out">−</button>
      <span className="home-pin" aria-hidden="true"><House size={18} color="#fff" /></span>
    </div>
  )
}

function HostSection() {
  return (
    <section className="section host-section">
      <h2>Meet your host</h2>
      <div className="host-layout">
        <article className="host-card">
          <div className="host-photo">
            <div className="host-avatar xl">M<span className="verified"><Check size={12} /></span></div>
            <strong>{property.host.name}</strong>
            <span>Host</span>
          </div>
          <div className="host-metrics">
            <div><b>{INR.format(property.host.reviews)}</b><span>Reviews</span></div>
            <div><b>{property.host.rating.toFixed(2)}★</b><span>Rating</span></div>
            <div><b>{property.host.years}</b><span>Years hosting</span></div>
          </div>
        </article>
        <div>
          <p className="host-bio"><CircleUserRound size={16} /> {property.host.born}</p>
          <p className="host-bio"><Images size={16} /> {property.host.school}</p>
          <h3>Co-Hosts</h3>
          <div className="cohosts">
            {property.host.coHosts.map((name) => (
              <div key={name}><span className="avatar-circle sm">{name[0]}</span>{name}</div>
            ))}
          </div>
          <h3>Host details</h3>
          <p>Response rate: {property.host.responseRate}</p>
          <p>{property.host.responseTime}</p>
          <button className="outline-button">Message host</button>
          <p className="protect-note"><Shield size={14} /> To help protect your payment, always use Airbnb to send money and communicate with hosts.</p>
        </div>
      </div>
    </section>
  )
}

function PhotoTour({
  onClose, onOpenLightbox, saved, onSave, onShare, startIndex,
}: {
  onClose: () => void
  onOpenLightbox: (src: string) => void
  saved: boolean
  onSave: () => void
  onShare: () => void
  startIndex: number
}) {
  const [activeId, setActiveId] = useState(property.tour[0].id)
  const [initialized, setInitialized] = useState(false)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const thumbsRef = useRef<HTMLDivElement | null>(null)

  const scrollTo = (id: string) => {
    document.getElementById(`tour-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveId(id)
    thumbsRef.current?.querySelector(`[data-thumb="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
  }

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return
    const onScroll = () => {
      const marker = (thumbsRef.current?.getBoundingClientRect().bottom ?? 196) + 12
      let current = property.tour[0].id
      for (const section of property.tour) {
        const el = document.getElementById(`tour-${section.id}`)
        if (el && el.getBoundingClientRect().top <= marker) current = section.id
      }
      setActiveId(current)
    }
    onScroll()
    overlay.addEventListener('scroll', onScroll, { passive: true })
    return () => overlay.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (initialized) return
    const src = startIndex > 0 ? property.images[startIndex]?.src : undefined
    if (!src) {
      setInitialized(true)
      return
    }
    const base = src.split('?')[0]
    const section = property.tour.find((s) => s.images.some((image) => image.src.split('?')[0] === base))
    if (section) scrollTo(section.id)
    setInitialized(true)
  }, [initialized, startIndex])

  return (
    <div className="overlay tour-overlay" role="dialog" aria-modal="true" aria-label="Photo tour" ref={overlayRef}>
      <div className="tour-topbar">
        <button className="round-close" autoFocus onClick={onClose} aria-label="Close photo tour"><ArrowLeft size={18} /></button>
        <div className="tour-title">Photo tour</div>
        <div className="tour-actions">
          <button className="icon-action" onClick={onShare} aria-label="Share photos"><Share size={18} /></button>
          <button className="icon-action" onClick={onSave} aria-label="Save listing"><Heart size={18} fill={saved ? '#222' : 'none'} /></button>
        </div>
      </div>
      <div className="tour-thumbs" ref={thumbsRef}>
        {property.tour.map((section) => (
          <button key={section.id} type="button" data-thumb={section.id} className={activeId === section.id ? 'active' : ''} onClick={() => scrollTo(section.id)}>
            <img src={section.images[0].src} alt="" />
            <span>{section.title}</span>
          </button>
        ))}
      </div>
      <div className="tour-scroll">
        {property.tour.map((section) => (
          <section key={section.id} id={`tour-${section.id}`} className="tour-block">
            <div className="tour-copy">
              <h2>{section.title}</h2>
              {section.summary && <p>{section.summary}</p>}
            </div>
            <div className="tour-photos">
              {section.images.map((image, imageIndex) => (
                <button key={`${section.id}-${imageIndex}`} className={image.span === 'half' ? 'half' : 'wide'} onClick={() => onOpenLightbox(image.src)}>
                  <img src={image.src} alt={image.alt} />
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function Lightbox({ index, images, onClose, onNext, onPrevious }: { index: number; images: { src: string; alt: string }[]; onClose: () => void; onNext: () => void; onPrevious: () => void }) {
  return (
    <div className="overlay lightbox-overlay" role="dialog" aria-modal="true" aria-label={`Photo ${index + 1} of ${images.length}`}>
      <button className="lightbox-close" autoFocus onClick={onClose} aria-label="Close photo"><X /></button>
      <button className="lightbox-arrow previous" onClick={onPrevious} aria-label="Previous photo"><ArrowLeft /></button>
      <figure>
        <img src={images[index].src} alt={images[index].alt} />
        <figcaption>{index + 1} / {images.length}</figcaption>
      </figure>
      <button className="lightbox-arrow next" onClick={onNext} aria-label="Next photo"><ArrowRight /></button>
    </div>
  )
}

function SimpleModal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="overlay modal-overlay" role="dialog" aria-modal="true" aria-label={title} onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-sheet">
        <button className="round-close" autoFocus onClick={onClose} aria-label="Close"><X size={16} /></button>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  )
}

export default App
