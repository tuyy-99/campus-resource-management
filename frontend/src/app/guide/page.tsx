"use client";

export default function GuidePage() {
  const sections = [
    {
      icon: "🚀",
      title: "Getting Started",
      items: [
        { step: "1", text: "Create your account or log in to access the system" },
        { step: "2", text: "Complete your profile with accurate information" },
        { step: "3", text: "Browse available resources in the Resources section" }
      ]
    },
    {
      icon: "📚",
      title: "Borrowing Resources",
      items: [
        { step: "1", text: "Go to Resources → Browse available items" },
        { step: "2", text: "Click on any resource to view details" },
        { step: "3", text: "Click 'Request' button to submit your request" },
        { step: "4", text: "Wait for admin approval (usually within 24 hours)" },
        { step: "5", text: "Receive notification when approved" }
      ]
    },
    {
      icon: "📋",
      title: "Managing Your Requests",
      items: [
        { step: "1", text: "Visit the 'Requests' page to see all your submissions" },
        { step: "2", text: "Track status: Pending, Approved, or Rejected" },
        { step: "3", text: "View request details and admin comments" },
        { step: "4", text: "Cancel pending requests if needed" }
      ]
    },
    {
      icon: "💡",
      title: "Tips for Success",
      items: [
        { step: "✓", text: "Provide clear reasons when requesting resources" },
        { step: "✓", text: "Check resource availability before requesting" },
        { step: "✓", text: "Return items on time to maintain good standing" },
        { step: "✓", text: "Contact support if you have any issues" }
      ]
    }
  ];

  const faqs = [
    {
      question: "How long does approval take?",
      answer: "Most requests are reviewed within 24 hours during business days. Urgent requests are prioritized."
    },
    {
      question: "Can I request multiple items at once?",
      answer: "Yes, you can submit multiple requests. Each item will be reviewed individually."
    },
    {
      question: "What if my request is rejected?",
      answer: "You'll receive feedback on why it was rejected and can resubmit with corrections if applicable."
    },
    {
      question: "How do I return borrowed items?",
      answer: "Follow the return instructions provided when your request is approved, or contact support for guidance."
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-mesh">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-purple-500/5" />
      
      <div className="relative mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-gradient-to-r from-violet-500 to-purple-500 p-5 shadow-xl shadow-violet-500/30 float-animation">
            <span className="text-3xl">📖</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            <span className="gradient-text">User Guide</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Everything you need to know about using the Campus Resource Management System effectively.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="card mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <span>🧭</span> Quick Navigation
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sections.map((section, index) => (
              <a
                key={index}
                href={`#section-${index}`}
                className="group flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 hover:from-violet-100 hover:to-purple-100 dark:hover:from-violet-900/30 dark:hover:to-purple-900/30 transition-all duration-300 hover:scale-105"
              >
                <span className="text-2xl">{section.icon}</span>
                <span className="font-semibold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400">
                  {section.title}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Guide Sections */}
        <div className="space-y-12">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} id={`section-${sectionIndex}`} className="card">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <span className="text-2xl">{section.icon}</span>
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm font-bold flex items-center justify-center">
                      {item.step}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="card mt-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="text-2xl">❓</span>
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-slate-200 dark:border-slate-700 pb-6 last:border-b-0 last:pb-0">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support CTA */}
        <div className="card-gradient mt-12 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Still Need Help?
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Our support team is here to assist you with any questions or issues you might have.
          </p>
          <a
            href="/support"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-violet-600 hover:to-purple-600 focus:ring-4 focus:ring-violet-500/25 transition-all duration-300 shadow-lg shadow-violet-500/25"
          >
            <span>🎧</span>
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
