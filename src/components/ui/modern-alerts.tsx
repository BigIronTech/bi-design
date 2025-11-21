import {
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Info,
  XCircle,
} from 'lucide-react'

export default function ModernBadgeAlert() {
  const alerts = [
    {
      variant: 'info',
      icon: Info,
      badge: 'Info',
      title: 'New Feature Available',
      description:
        'Check out our latest updates to improve your workflow and productivity.',
      badgeColor: 'bg-blue-500',
      bgColor: 'bg-gradient-to-r from-blue-50 to-blue-100/50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      showIcon: false,
      showDescription: false,
      hasAction: true,
    },
    {
      variant: 'success',
      icon: CheckCircle,
      badge: 'Success',
      title: 'Payment Processed',
      description:
        'Your transaction has been completed successfully and a receipt has been sent to your email.',
      badgeColor: 'bg-green-500',
      bgColor: 'bg-gradient-to-r from-green-50 to-green-100/50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      showIcon: false,
      showDescription: false,
      hasAction: true,
    },
    {
      variant: 'warning',
      icon: AlertTriangle,
      badge: 'Warning',
      title: 'Action Required',
      description:
        'Your subscription will expire in 3 days. Renew now to avoid service interruption.',
      badgeColor: 'bg-amber-500',
      bgColor: 'bg-gradient-to-r from-amber-50 to-amber-100/50',
      borderColor: 'border-amber-200',
      iconColor: 'text-amber-600',
      showIcon: false,
      showDescription: false,
      hasAction: true,
    },
    {
      variant: 'error',
      icon: XCircle,
      badge: 'Error',
      title: 'Upload Failed',
      description:
        'There was an error processing your file. Please check the format and try again.',
      badgeColor: 'bg-red-500',
      bgColor: 'bg-gradient-to-r from-red-50 to-red-100/50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      showIcon: false,
      showDescription: false,
      hasAction: true,
    },
  ]

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Modern Badge Alerts
          </h1>
          <p className="text-slate-600">
            Contemporary alert design with badge indicators
          </p>
        </div>

        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`relative rounded-full ${alert.bgColor} py-1 px-2 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}
          >
            <div className="flex items-center gap-4">
              {alert.showIcon && (
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full ${alert.bgColor} border-2 ${alert.borderColor} flex items-center justify-center`}
                >
                  <alert.icon className={`w-6 h-6 ${alert.iconColor}`} />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span
                    className={`${alert.badgeColor} text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm`}
                  >
                    {alert.badge}
                  </span>
                  <h3 className="text-md font-medium text-slate-900">
                    {alert.title}
                  </h3>
                </div>
                {alert.showDescription && (
                  <p className="text-slate-700 leading-relaxed">
                    {alert.description}
                  </p>
                )}
              </div>

              <button
                onClick={() => console.log('Action clicked for:', alert.title)}
                className={`flex-shrink-0 w-8 h-8 rounded-full hover:${alert.badgeColor} hover:bg-opacity-10 flex items-center justify-center transition-all duration-200 group`}
                aria-label="Take action"
              >
                <ChevronRight
                  className={`w-5 h-5 ${alert.iconColor} group-hover:translate-x-0.5 transition-transform`}
                />
              </button>
            </div>
          </div>
        ))}

        <div className="mt-12 p-6 bg-white rounded-xl border-2 border-slate-200 shadow-lg">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Design Features
          </h2>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Gradient backgrounds with subtle color transitions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">•</span>
              <span>Circular icon containers with matching borders</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span>Colored badge labels for quick status identification</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span>Hover effects with enhanced shadows for interactivity</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold">•</span>
              <span>Action buttons with chevron indicators</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500 font-bold">•</span>
              <span>Compact, badge-focused design without borders</span>
            </li>
          </ul>
          <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm text-slate-600">
              <span className="font-semibold">Minimal design:</span> Compact
              alerts with just badges, titles, and action buttons for a clean,
              streamlined interface.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
