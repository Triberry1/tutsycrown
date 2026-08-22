import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="panel">
        <p className="eyebrow">Tutsy Crown</p>
        <h1>Clerk authentication test</h1>
        <p className="lede">Use the controls below to test sign-in, sign-up, and the authenticated session.</p>
        <div className="actions">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="button button-primary">Sign in</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="button button-secondary">Create account</button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
            <span>You are signed in.</span>
          </Show>
        </div>
      </section>
    </main>
  )
}
