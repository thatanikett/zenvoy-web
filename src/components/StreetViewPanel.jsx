import { useEffect, useRef } from 'react'
import { Viewer } from 'mapillary-js'

const MAPILLARY_TOKEN = import.meta.env.VITE_MAPILLARY_TOKEN

export default function StreetViewPanel({
  open,
  image,
  loading,
  error,
  location,
  onClose,
}) {
  const containerRef = useRef(null)
  const viewerRef = useRef(null)

  useEffect(() => {
    if (!open || !containerRef.current || !MAPILLARY_TOKEN || !image?.id || viewerRef.current) {
      return
    }

    viewerRef.current = new Viewer({
      accessToken: MAPILLARY_TOKEN,
      container: containerRef.current,
      imageId: image.id,
    })

    return () => {
      viewerRef.current?.remove?.()
      viewerRef.current = null
    }
  }, [image?.id, open])

  useEffect(() => {
    if (!viewerRef.current || !image?.id) return
    viewerRef.current.moveTo(image.id).catch(() => {})
  }, [image?.id])

  if (!open) return null

  return (
    <aside className="street-view-panel" style={{
      background: 'rgba(7, 10, 14, 0.92)',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 24px 60px rgba(0,0,0,0.38)',
      backdropFilter: 'blur(18px)',
      animation: 'fadeUp 0.28s ease',
    }}>
      <div style={{
        padding: '16px 18px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.14em',
            color: 'var(--accent-safe)',
          }}>
            MAPILLARY STREET VIEW
          </span>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            lineHeight: 1.5,
            color: 'var(--text-secondary)',
          }}>
            {location
              ? `Lat ${location.lat.toFixed(5)}, Lng ${location.lng.toFixed(5)}`
              : 'Click the map to inspect nearby imagery.'}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={closeButtonStyle}
        >
          Close
        </button>
      </div>

      <div style={{
        position: 'relative',
        flex: 1,
        minHeight: 260,
        background: 'linear-gradient(180deg, rgba(20,26,32,0.94), rgba(8,12,16,1))',
      }}>
        {loading && (
          <PanelMessage
            title="Loading imagery"
            body="Searching for the nearest Mapillary capture around the point you selected."
          />
        )}

        {!loading && error && (
          <PanelMessage
            title="Street view unavailable"
            body={error}
          />
        )}

        {!loading && !error && !image && (
          <PanelMessage
            title="No image selected"
            body="Click anywhere on the map to open the closest available Mapillary street-view scene."
          />
        )}

        <div
          ref={containerRef}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: !loading && !error && image ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        />
      </div>

      <div style={{
        padding: '14px 18px 16px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          minWidth: 0,
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.12em',
            color: 'var(--text-muted)',
          }}>
            IMAGE ID
          </span>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {image?.id || 'Waiting for selection'}
          </span>
        </div>
      </div>
    </aside>
  )
}

function PanelMessage({ title, body }) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      padding: '24px',
    }}>
      <div style={{
        maxWidth: 320,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        textAlign: 'center',
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '24px',
          lineHeight: 1.1,
          color: 'var(--text-primary)',
        }}>
          {title}
        </span>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          lineHeight: 1.6,
          color: 'var(--text-secondary)',
        }}>
          {body}
        </span>
      </div>
    </div>
  )
}

const closeButtonStyle = {
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '999px',
  padding: '10px 14px',
  background: 'rgba(255,255,255,0.03)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  letterSpacing: '0.08em',
  cursor: 'pointer',
}
