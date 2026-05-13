# expenc

Small expense tracker: add rows, filter/sort them, see a pie chart and a simple weekly bar chart. Everything stays in the browser (`localStorage`), so there’s no login and no server, good for a demo or personal use on one machine.

Stack is whatever `create-next-app` gave us (Next.js App Router, TypeScript, Tailwind v4) plus Recharts for the graphs.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. Production build: `npm run build` then `npm run start`.

## Notes

- Data lives under the key `expenses` in localStorage. Clear site data if you want a fresh slate.
- Charts only show something useful once there’s at least one expense in the filtered set.
- The weekly bucket groups by “week starting Sunday” in local time — good enough for a toy app, not accounting software.

## Layout of the repo

`src/app` — `page.tsx` is the main screen, `layout.tsx` + `globals.css` are global shell/styles.  
`src/components` — form, list, filters, charts, error boundary.  
`src/hooks/useExpenses.ts` — load/save + CRUD helpers.  
`src/types`, `src/utils` — types, formatters, validation.
