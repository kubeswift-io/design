# CodePanel

YAML, shell or Go on a slide, on a `code-bg` panel with line numbers and the one line that matters highlighted.

- Provide: 10 to 14 lines of real code. Mark the line the slide is about with `.ks-hl` and wrap its value in `.ks-code-val`; wrap keys in `.ks-code-key`.
- Shell: replace line numbers with a `$` prompt in `code-value`.
- Do highlight one line, two at most. Don't shrink the font to fit more lines; cut the code instead.
- Line numbers in `code-muted` are below 4.5:1 by design; never put information only in them.
