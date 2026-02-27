import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

export interface Rep {
  id: number
  name: string
  title: string
  type: 'Equipment' | 'Real Estate' | 'Livestock'
  phone: string
  email: string
  states: Array<string>
  counties: Array<string>
  photo: string
  bio: string
  lat: number
  lng: number
}

interface RepLocationMapProps {
  onStateClick?: (stateCode: string) => void
  onRepClick?: (rep: Rep) => void
  repLocations: Array<Rep>
}

export interface RepLocationMapHandle {
  zoomToLocation: (lat: number, lng: number) => void
}

const RepLocationMap = forwardRef<RepLocationMapHandle, RepLocationMapProps>(
  ({ onStateClick, onRepClick, repLocations }, ref) => {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<any>(null)

    // Expose zoomToLocation function to parent
    useImperativeHandle(ref, () => ({
      zoomToLocation: (lat: number, lng: number) => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng], 8, { animate: true })
        }
      },
    }))

    useEffect(() => {
      // Only run on client side
      if (typeof window === 'undefined' || !mapRef.current) return

      // Dynamically import Leaflet (client-side only)
      import('leaflet').then((L) => {
        // Clean up existing map
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
        }

        // Create map centered on the US heartland
        const map = L.map(mapRef.current as HTMLElement, {
          zoomControl: true,
          scrollWheelZoom: true,
          dragging: true,
          doubleClickZoom: false,
          boxZoom: false,
          keyboard: false,
        }).setView([39.5, -98.5], 4) // Center on central US

        mapInstanceRef.current = map

        // Add tile layer (CartoDB light theme for clean look)
        L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
          {
            attribution: '© OpenStreetMap contributors © CARTO',
            maxZoom: 10,
          },
        ).addTo(map)

        // Custom icons for different rep types
        const createIcon = (
          type: 'Equipment' | 'Real Estate' | 'Livestock',
        ) => {
          let iconSvg = ''
          let color = ''

          if (type === 'Equipment') {
            color = '#ffcf01' // yellow
            iconSvg = `<svg width="20" height="20" viewBox="0 0 576 512" fill="${color}" stroke="none" stroke-width="2">
            <path d="M160 96l0 96 133.4 0-57.6-96-75.8 0zM96 223L96 64c0-17.7 14.3-32 32-32l107.8 0c22.5 0 43.3 11.8 54.9 31.1l77.4 128.9 64 0 0-72c0-13.3 10.7-24 24-24s24 10.7 24 24l0 72 48 0c26.5 0 48 21.5 48 48l0 41.5c0 14.2-6.3 27.8-17.3 36.9l-35 29.2c26.5 15.2 44.3 43.7 44.3 76.4 0 48.6-39.4 88-88 88s-88-39.4-88-88c0-14.4 3.5-28 9.6-40l-101.2 0c-3 13.4-7.9 26-14.4 37.7 7.7 9.4 7.2 23.4-1.6 32.2l-22.6 22.6c-8.8 8.8-22.7 9.3-32.2 1.6-9.3 5.2-19.3 9.3-29.8 12.3-1.2 12.1-11.4 21.6-23.9 21.6l-32 0c-12.4 0-22.7-9.5-23.9-21.6-10.5-3-20.4-7.2-29.8-12.3-9.4 7.7-23.4 7.2-32.2-1.6L35.5 453.8c-8.8-8.8-9.3-22.7-1.6-32.2-5.2-9.3-9.3-19.3-12.3-29.8-12.1-1.2-21.6-11.4-21.6-23.9l0-32c0-12.4 9.5-22.7 21.6-23.9 3-10.5 7.2-20.4 12.3-29.8-7.7-9.4-7.2-23.4 1.6-32.2l22.6-22.6c8.8-8.8 22.7-9.3 32.2-1.6 1.9-1 3.7-2 5.7-3zm64 65a64 64 0 1 0 0 128 64 64 0 1 0 0-128zM440 424a40 40 0 1 0 80 0 40 40 0 1 0 -80 0z"/>          </svg>`
          } else if (type === 'Real Estate') {
            color = '#10B981' // emerald
            iconSvg = `<svg width="20" height="20" viewBox="0 0 576 512" fill="${color}" stroke="none" stroke-width="2">
            <path d="M112-32C50.1-32 0 18.1 0 80l0 2.2 196 0 27.5-12.5C218.3 12.7 170.4-32 112-32zM80 292.5c0-8.1 1.3-16.2 3.9-23.9l40-119.9c2.2-6.5 5-12.7 8.4-18.5L0 130.2 0 464c0 26.5 21.5 48 48 48l84.1 0c-12.7-18.1-20.1-40.2-20.1-64l0-93.8C92.6 340.5 80 318 80 292.5zm89.4-128.6l-40 119.9c-.9 2.8-1.4 5.7-1.4 8.7 0 15.2 12.3 27.5 27.5 27.5l4.5 0 0 128c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-128 4.5 0c15.2 0 27.5-12.3 27.5-27.5 0-3-.5-5.9-1.4-8.7l-40-119.9c-4.2-12.7-13.5-23-25.7-28.5L371.9 73c-12.6-5.7-27.1-5.7-39.7 0L195.1 135.3c-12.2 5.5-21.5 15.9-25.7 28.5zM320 336l64 0c17.7 0 32 14.3 32 32l0 96-128 0 0-96c0-17.7 14.3-32 32-32zM304 200c0-13.3 10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 48c0 13.3-10.7 24-24 24l-48 0c-13.3 0-24-10.7-24-24l0-48z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>`
          } else {
            color = '#733e0b' // yellow-900
            iconSvg = `<svg width="20" height="20" viewBox="0 0 640 512" fill="${color}" stroke="none" stroke-width="2">
            <path d="M96 224l0 192c0 17.7 14.3 32 32 32l32 0c17.7 0 32-14.3 32-32l0-88.2c9.9 6.6 20.6 12 32 16.1l0 24.2c0 8.8 7.2 16 16 16s16-7.2 16-16l0-16.9c5.3 .6 10.6 .9 16 .9s10.7-.3 16-.9l0 16.9c0 8.8 7.2 16 16 16s16-7.2 16-16l0-24.2c11.4-4 22.1-9.4 32-16.1l0 88.2c0 17.7 14.3 32 32 32l32 0c17.7 0 32-14.3 32-32l0-160 32 32 0 49.5c0 9.5 2.8 18.7 8.1 26.6L530 427c8.8 13.1 23.5 21 39.3 21 22.5 0 41.9-15.9 46.3-38l20.3-101.6c2.6-13-.3-26.5-8-37.3l-3.9-5.5 0-81.6c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 14.4-52.9-74.1C496 86.5 452.4 64 405.9 64L144 64C77.7 64 24 117.7 24 184l0 54C9.4 249.8 0 267.8 0 288l0 17.6c0 8 6.4 14.4 14.4 14.4 31.8 0 57.6-25.8 57.6-57.6L72 184c0-24.3 12.1-45.8 30.5-58.9-4.2 10.8-6.5 22.6-6.5 34.9l0 64zM560 336a16 16 0 1 1 32 0 16 16 0 1 1 -32 0zM166.6 166.6c-4.2-4.2-6.6-10-6.6-16 0-12.5 10.1-22.6 22.6-22.6l178.7 0c12.5 0 22.6 10.1 22.6 22.6 0 6-2.4 11.8-6.6 16l-23.4 23.4C332.2 211.8 302.7 224 272 224s-60.2-12.2-81.9-33.9l-23.4-23.4z"/>
          </svg>`
          }

          return L.divIcon({
            html: `
            <div style="
              width: 40px;
              height: 40px;
              background: white;
              border: 3px solid ${color};
              border-radius: 50%;
              display: grid;
              place-items: center;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              cursor: pointer;
              transition: transform 0.2s, box-shadow 0.2s;
            ">
              ${iconSvg}
            </div>
          `,
            className: '',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          })
        }

        // Add markers for each rep location
        repLocations.forEach((rep) => {
          const marker = L.marker([rep.lat, rep.lng], {
            icon: createIcon(rep.type),
          })
            .addTo(map)
            .bindPopup(
              `<div style="text-align: center;">
              <strong>${rep.name}</strong><br/>
              <span style="font-size: 12px;">${rep.title}</span><br/>
              <span style="font-size: 11px; color: #666;">Click to view details</span>
            </div>`,
              {
                closeButton: false,
              },
            )

          // Add click handler to select the rep and state
          marker.on('click', () => {
            if (onRepClick) {
              onRepClick(rep)
            }
            if (onStateClick && rep.states[0]) {
              onStateClick(rep.states[0])
            }
          })

          // Add hover effects
          marker.on('mouseover', function (this: any) {
            const icon = this.getElement()
            if (icon) {
              const iconDiv = icon.querySelector('div')
              if (iconDiv) {
                iconDiv.style.transform = 'scale(1.1)'
                iconDiv.style.boxShadow =
                  '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
              }
            }
            this.openPopup()
          })

          marker.on('mouseout', function (this: any) {
            const icon = this.getElement()
            if (icon) {
              const iconDiv = icon.querySelector('div')
              if (iconDiv) {
                iconDiv.style.transform = 'scale(1)'
                iconDiv.style.boxShadow =
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }
            }
          })
        })

        // Fit bounds to show all markers with some padding
        // if (repLocations.length > 0) {
        //  const bounds = L.latLngBounds(repLocations.map((r) => [r.lat, r.lng]))
        //  map.fitBounds(bounds, { padding: [50, 50] })
        // }
      })

      // Cleanup on unmount
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
        }
      }
    }, []) // Only run once on mount

    return (
      <div className="w-full bg-card relative border border-border rounded-lg h-full flex flex-col">
        {/* Map container - full width, full height */}
        <div
          ref={mapRef}
          className="w-full flex-1 rounded-lg"
          style={{ background: '#f8f9fa', minHeight: '300px' }}
        />

        {/* Overlay info bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-border px-4 py-3">
          <div className="flex items-center justify-between max-w-full mx-auto">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {repLocations.length} Rep Locations
              </p>
              <p className="text-xs text-muted-foreground">
                Serving 24 states across the central United States
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-6 h-6 rounded-full border-2 border-amber-500 bg-white grid place-items-center">
                <div className="w-2 h-2 bg-amber-500 rounded-full" />
              </div>
              <span>Click to select state</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
)

RepLocationMap.displayName = 'RepLocationMap'

export default RepLocationMap
