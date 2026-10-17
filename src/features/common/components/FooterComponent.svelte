<script>
  import { siteInfo } from "../../../data/content";

  const year = new Date().getFullYear();
</script>

<footer class="mt-24 bg-ink-900 text-ivory">
  <div class="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
    <div>
      <p class="font-display text-2xl font-extrabold">
        Ekraf<span class="text-gold-300">Chain</span>
      </p>
      <p class="mt-2 text-sm text-ink-300">{siteInfo.tagline}</p>
    </div>

    <div>
      <p class="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">Tautan</p>
      <a
        href={siteInfo.ministryUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="footer-ministry"
        class="mt-3 inline-block text-sm underline underline-offset-4 hover:text-gold-300"
      >
        {siteInfo.ministryName}
      </a>
    </div>

    <div>
      <p class="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">Kontak</p>
      <a
        href={`mailto:${siteInfo.contactEmail}`}
        data-testid="footer-contact"
        class="mt-3 inline-block text-sm underline underline-offset-4 hover:text-gold-300"
      >
        {siteInfo.contactEmail}
      </a>
    </div>
  </div>

  <div class="border-t border-white/10 py-5 text-center text-xs text-ink-300">
    <p data-testid="footer-copyright">&copy; {year} EkrafChain. Seluruh hak cipta dilindungi.</p>
    <p class="mt-1">Data pada situs ini adalah data mockup untuk keperluan demonstrasi.</p>
  </div>
</footer>
