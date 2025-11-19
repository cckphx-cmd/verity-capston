# Business Intelligence Suite

A modern, production-ready RAG (Retrieval Augmented Generation) application for business document analysis. Built with Next.js 14, TypeScript, Tailwind CSS, and Claude AI.

## ✨ Features

- 📄 **PDF Document Upload & Processing** - Drag & drop multiple PDFs
- 💬 **AI-Powered Q&A** - Ask questions about your documents using Claude Sonnet 4
- 📊 **Analytics Dashboard** - Track usage, documents, and insights
- 🎨 **Beautiful Executive UI** - Professional design matching portfolio aesthetic
- 🧠 **Brand Voice Assistant** - Analyze and maintain consistent brand voice
- ⚙️ **Customizable Settings** - Configure AI behavior and response style
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- An Anthropic API key ([get one here](https://console.anthropic.com/))

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
```

Then edit `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```

3. **Run development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
rag-suite/
├── app/
│   ├── api/
│   │   ├── upload/
│   │   │   └── route.ts      # PDF upload endpoint
│   │   └── query/
│   │       └── route.ts      # Document Q&A endpoint
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main application page
├── uploads/                  # Uploaded documents (auto-created)
├── .env.example              # Environment variables template
├── next.config.js            # Next.js configuration
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind CSS config
└── tsconfig.json             # TypeScript config
```

## 📦 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Claude Sonnet 4 (via Anthropic API)
- **PDF Processing:** pdf-parse
- **Icons:** Lucide React

## 🎨 Design System

The app uses a custom cream/beige color palette:

- **Primary:** `#8B7355` (Cream 500)
- **Background:** `#F5F1EA` (Cream 100)
- **Borders:** `#E5DFD3` (Cream 200)
- **Text:** `#3D3D3D` (Cream 900)
- **Accents:** `#C8B89A` (Cream 400)

## 🚀 Deployment

### Deploy to Vercel (Recommended - 1 Click)

1. **Push your code to GitHub**

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Add environment variable: `ANTHROPIC_API_KEY`
   - Click "Deploy"

3. **Done!** Your app will be live at `https://your-app.vercel.app`

### Alternative: Deploy to Netlify

1. **Push to GitHub**

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site"
   - Import from GitHub
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Add environment variable: `ANTHROPIC_API_KEY`

## 🔧 Configuration

### API Key Setup

Your Anthropic API key can be set in multiple ways:

1. **Environment Variable (Recommended):**
```bash
# In .env file
ANTHROPIC_API_KEY=sk-ant-your-key
```

2. **Vercel Dashboard:**
Settings → Environment Variables → Add

3. **Local Development:**
Create a `.env.local` file (not committed to git)

### Customization

**Change Colors:**
Edit `tailwind.config.js` to modify the color scheme

**Adjust Upload Limits:**
Edit `next.config.js`:
```javascript
api: {
  bodyParser: {
    sizeLimit: '50mb', // Change this
  },
}
```

**Modify AI Behavior:**
Edit `/app/api/query/route.ts` to change:
- Model (currently `claude-sonnet-4-20250514`)
- Max tokens
- System prompts

## 📝 Usage

1. **Upload Documents:**
   - Click "Browse files" or drag & drop PDFs
   - Wait for processing (extracts text automatically)

2. **Ask Questions:**
   - Type your question in the chat box
   - Claude will analyze all uploaded documents
   - Get answers with document citations

3. **View Analytics:**
   - See real-time stats on documents and queries
   - Track usage and time saved

## 🧪 Testing Locally

```bash
# Start dev server
npm run dev

# In another terminal, test the API:
curl -X POST http://localhost:3000/api/upload \
  -F "files=@test.pdf"

curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query":"What is this about?","documents":["test.pdf"]}'
```

## 🐛 Troubleshooting

**"API key not configured" error:**
- Make sure `.env` file exists with `ANTHROPIC_API_KEY`
- Restart the dev server after adding the key

**Upload fails:**
- Check file size is under 50MB
- Ensure file is a valid PDF
- Check browser console for errors

**No response from AI:**
- Verify API key is valid at console.anthropic.com
- Check you have API credits available
- Look at server logs for error messages

**Build fails:**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

## 🔐 Security

- API keys are stored in environment variables (never in code)
- File uploads are validated (PDFs only, size limits)
- User data stays server-side
- No authentication required (add if needed for production)

## 📈 Performance

- **First Load:** ~2-3s
- **Upload Processing:** 1-5s per PDF (depending on size)
- **Query Response:** 2-10s (depending on document size)

**Optimization Tips:**
- Keep PDFs under 10MB for best performance
- Limit to 20-30 documents per session
- Use caching for frequently asked questions

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Anthropic API Docs](https://docs.anthropic.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 License

MIT License - feel free to use for your portfolio!

## 🙏 Credits

Built by Courtney Kingsbury
Powered by Claude AI (Anthropic)

---

## 🎯 Next Steps After Deployment

1. **Add to Portfolio:**
   - Add a project card to courtneykingsbury.com
   - Include screenshots and live demo link
   - Write case study explaining the build

2. **Enhance Features:**
   - Add user authentication (Clerk/Auth0)
   - Implement vector database for better search
   - Add export functionality (PDF reports)
   - Create shareable links for conversations

3. **Optimize:**
   - Add response caching
   - Implement rate limiting
   - Add error boundaries
   - Set up analytics (Vercel Analytics)

4. **Scale:**
   - Add database for persistent storage
   - Implement team collaboration features
   - Add API for programmatic access
   - Create mobile app version

---

**Questions?** Open an issue or contact via your portfolio site!
