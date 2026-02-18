# Auto-Push to Git & Vercel

When you run `npm run watch-push`, any file you save will automatically:

1. **Commit** your changes  
2. **Push** to GitHub  
3. **Trigger** a Vercel deployment  

No manual `git add`, `git commit`, or `git push` needed.

---

## How to use

**1. Start the watcher**

Open a terminal in your project and run:

```bash
npm run watch-push
```

Leave this running while you work. You'll see:

```
Auto-push watcher running. Saving files will trigger git push in 15s.
Press Ctrl+C to stop.
```

**2. Edit and save files**

When you save a file, you'll see something like:

```
[2:30:15 PM] Change: app/admin/products/page.tsx → pushing in 15s (Ctrl+C to cancel)
```

**3. Wait 15 seconds**

After 15 seconds without new changes, it will commit and push. Vercel will then deploy.

**4. Stop the watcher**

Press **Ctrl+C** to stop when you're done.

---

## What gets watched

- `app/`  
- `components/`  
- `lib/`  
- `public/`  
- `types/`  
- Config files (e.g. `next.config.js`, `tailwind.config.ts`)  
- Other project files  

Ignored: `node_modules`, `.next`, `.git`, `.env`

---

## Tips

- **15-second delay** – Multiple edits in a short time become one commit  
- **Cancel a push** – Press Ctrl+C before the 15 seconds are up  
- **Run in separate terminal** – Keep it running while you use `npm run dev` in another terminal  
