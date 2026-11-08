import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    COLOR_BG = RGBColor(8, 8, 8)
    COLOR_CARD = RGBColor(14, 17, 24)
    COLOR_GOLD = RGBColor(230, 213, 183)
    COLOR_GOLD_DARK = RGBColor(194, 171, 134)
    COLOR_WHITE = RGBColor(245, 245, 245)
    COLOR_GRAY = RGBColor(161, 161, 170)
    COLOR_GREEN = RGBColor(37, 211, 102)

    blank_slide_layout = prs.slide_layouts[6]

    def set_slide_bg(slide, color=COLOR_BG):
        bg = slide.background
        fill = bg.fill
        fill.solid()
        fill.fore_color.rgb = color

    def add_header(slide, title_text, category_text="RADHE RADIOS • WEBSITE WALKTHROUGH"):
        # Category / Eyebrow
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.name = "Arial"
        p_cat.font.size = Pt(10)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_GOLD

        # Title
        t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.6))
        tf_t = t_box.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.text = title_text.upper()
        p_t.font.name = "Arial"
        p_t.font.size = Pt(22)
        p_t.font.bold = True
        p_t.font.color.rgb = COLOR_WHITE

        # Divider line
        shape = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.35), Inches(11.733), Inches(0.02)
        )
        shape.fill.solid()
        shape.fill.fore_color.rgb = COLOR_GOLD_DARK
        shape.line.fill.background()

    def add_content_slide(title, category, img_name, bullet_points, side_heading="OVERVIEW & KEY HIGHLIGHTS"):
        slide = prs.slides.add_slide(blank_slide_layout)
        set_slide_bg(slide)
        add_header(slide, title, category)

        img_path = os.path.join("public", "screenshots", img_name)
        
        # Left side: Screenshot Image
        if os.path.exists(img_path):
            img_left = Inches(0.8)
            img_top = Inches(1.6)
            img_width = Inches(7.8)
            img_height = Inches(4.8)
            
            # Subtle card border around image
            border_shape = slide.shapes.add_shape(
                MSO_SHAPE.ROUNDED_RECTANGLE,
                img_left - Inches(0.06),
                img_top - Inches(0.06),
                img_width + Inches(0.12),
                img_height + Inches(0.12)
            )
            border_shape.fill.solid()
            border_shape.fill.fore_color.rgb = COLOR_CARD
            border_shape.line.color.rgb = COLOR_GOLD_DARK
            border_shape.line.width = Pt(1.5)

            slide.shapes.add_picture(img_path, img_left, img_top, width=img_width, height=img_height)

        # Right side: Content Card
        card_left = Inches(8.9)
        card_top = Inches(1.6)
        card_width = Inches(3.633)
        card_height = Inches(4.8)

        card_shape = slide.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE, card_left, card_top, card_width, card_height
        )
        card_shape.fill.solid()
        card_shape.fill.fore_color.rgb = COLOR_CARD
        card_shape.line.color.rgb = COLOR_GOLD_DARK
        card_shape.line.width = Pt(1)

        tx_box = slide.shapes.add_textbox(
            card_left + Inches(0.2), card_top + Inches(0.2), card_width - Inches(0.4), card_height - Inches(0.4)
        )
        tf = tx_box.text_frame
        tf.word_wrap = True

        p0 = tf.paragraphs[0]
        p0.text = side_heading
        p0.font.name = "Arial"
        p0.font.size = Pt(12)
        p0.font.bold = True
        p0.font.color.rgb = COLOR_GOLD
        p0.space_after = Pt(14)

        for pt in bullet_points:
            p = tf.add_paragraph()
            p.text = f"• {pt}"
            p.font.name = "Arial"
            p.font.size = Pt(10.5)
            p.font.color.rgb = COLOR_WHITE
            p.space_after = Pt(10)

        # Bottom Coordinates tag on slide
        footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(6.8), Inches(11.733), Inches(0.35))
        tf_f = footer_box.text_frame
        p_f = tf_f.paragraphs[0]
        p_f.text = "RADHE RADIOS • TRANSPORT NAGAR, KOTA, RAJASTHAN • +91 98871 58522 / +91 95090 40057"
        p_f.font.name = "Arial"
        p_f.font.size = Pt(8.5)
        p_f.font.color.rgb = COLOR_GRAY

    # ─────────────────────────────────────────────────────────────
    # SLIDE 1: Title Slide (Luxury Cover)
    # ─────────────────────────────────────────────────────────────
    slide_cover = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(slide_cover)

    # Decorative Border
    cover_frame = slide_cover.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(11.733), Inches(5.9)
    )
    cover_frame.fill.solid()
    cover_frame.fill.fore_color.rgb = COLOR_CARD
    cover_frame.line.color.rgb = COLOR_GOLD
    cover_frame.line.width = Pt(2)

    # Monogram Badge
    mono = slide_cover.shapes.add_shape(
        MSO_SHAPE.OVAL, Inches(6.166), Inches(1.3), Inches(1.0), Inches(1.0)
    )
    mono.fill.solid()
    mono.fill.fore_color.rgb = RGBColor(24, 28, 38)
    mono.line.color.rgb = COLOR_GOLD
    mono.line.width = Pt(2)
    tf_m = mono.text_frame
    pm = tf_m.paragraphs[0]
    pm.text = "RR"
    pm.alignment = PP_ALIGN.CENTER
    pm.font.name = "Arial"
    pm.font.size = Pt(20)
    pm.font.bold = True
    pm.font.color.rgb = COLOR_GOLD

    # Title & Subtitle Box
    tbox = slide_cover.shapes.add_textbox(Inches(1.2), Inches(2.45), Inches(10.933), Inches(3.8))
    tf = tbox.text_frame
    tf.word_wrap = True

    p_badge = tf.paragraphs[0]
    p_badge.text = "ESTABLISHED 2018 • TRANSPORT NAGAR, KOTA (RAJASTHAN)"
    p_badge.alignment = PP_ALIGN.CENTER
    p_badge.font.name = "Arial"
    p_badge.font.size = Pt(11)
    p_badge.font.bold = True
    p_badge.font.color.rgb = COLOR_GOLD
    p_badge.space_after = Pt(12)

    p_main = tf.add_paragraph()
    p_main.text = "RADHE RADIOS"
    p_main.alignment = PP_ALIGN.CENTER
    p_main.font.name = "Arial"
    p_main.font.size = Pt(40)
    p_main.font.bold = True
    p_main.font.color.rgb = COLOR_WHITE
    p_main.space_after = Pt(8)

    p_sub = tf.add_paragraph()
    p_sub.text = "High-Performance Vehicle Audio & Custom Heavy-Duty Power Amplifiers"
    p_sub.alignment = PP_ALIGN.CENTER
    p_sub.font.name = "Arial"
    p_sub.font.size = Pt(16)
    p_sub.font.bold = True
    p_sub.font.color.rgb = COLOR_GOLD
    p_sub.space_after = Pt(14)

    p_desc = tf.add_paragraph()
    p_desc.text = "Official Website Showcase, Sound Engineering Rig Architecture & Product Portfolio"
    p_desc.alignment = PP_ALIGN.CENTER
    p_desc.font.name = "Arial"
    p_desc.font.size = Pt(12)
    p_desc.font.color.rgb = COLOR_GRAY
    p_desc.space_after = Pt(24)

    p_contact = tf.add_paragraph()
    p_contact.text = "Helpline: +91 98871 58522 | Direct Desk: +91 95090 40057 | Kota, Rajasthan"
    p_contact.alignment = PP_ALIGN.CENTER
    p_contact.font.name = "Arial"
    p_contact.font.size = Pt(11)
    p_contact.font.bold = True
    p_contact.font.color.rgb = COLOR_WHITE

    # ─────────────────────────────────────────────────────────────
    # SLIDE 2: Executive Summary & Project Structure
    # ─────────────────────────────────────────────────────────────
    slide_exec = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(slide_exec)
    add_header(slide_exec, "Executive Summary & Website System Architecture", "BRAND FOUNDATION & DIGITAL PLATFORM")

    exec_grid = [
        ("01. BRAND IDENTITY", "Radhe Radios, established in 2018 in Transport Nagar, Kota, Rajasthan. A trusted name in high-performance vehicle and professional audio solutions."),
        ("02. CORE SPECIALIZATION", "Custom, heavy-duty power amplifiers (Proudly Made in India, Class-A architecture) and professional-grade high-SPL speakers."),
        ("03. PHILOSOPHY", "Quality & Value — True 'Paisa Vasool'. Every single rupee spent by customers is completely worth it, backed by years of durability."),
        ("04. 3 CORE PILLARS", "1) Premium Sound Engineering\n2) Built to Last\n3) Customer First Satisfaction Guaranteed."),
        ("05. FULL WEBSITE SUITE", "Seamless SPA routing with Home, About Us, Products Catalog, Services, Pan-India Dealership Desk, and Standalone Client Demo."),
        ("06. 100% PRESERVED ANIMATIONS", "Original 775-frame cinematic 3D scroll-scrub sequence, GSAP ScrollTrigger canvas physics, and fluid entrance reveals remain 100% active.")
    ]

    for idx, (head, text) in enumerate(exec_grid):
        col = idx % 3
        row = idx // 3
        box_left = Inches(0.8 + col * 4.0)
        box_top = Inches(1.6 + row * 2.5)
        box_w = Inches(3.733)
        box_h = Inches(2.2)

        card = slide_exec.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, box_left, box_top, box_w, box_h)
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD
        card.line.color.rgb = COLOR_GOLD_DARK
        card.line.width = Pt(1)

        t_box = slide_exec.shapes.add_textbox(box_left + Inches(0.18), box_top + Inches(0.18), box_w - Inches(0.36), box_h - Inches(0.36))
        tf_e = t_box.text_frame
        tf_e.word_wrap = True

        p1 = tf_e.paragraphs[0]
        p1.text = head
        p1.font.name = "Arial"
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_GOLD
        p1.space_after = Pt(6)

        p2 = tf_e.add_paragraph()
        p2.text = text
        p2.font.name = "Arial"
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = COLOR_WHITE

    # ─────────────────────────────────────────────────────────────
    # SLIDE 3: Home Page Experience & Sound Engine
    # ─────────────────────────────────────────────────────────────
    add_content_slide(
        title="Home Page — Interactive Sound Rigs & Hero Engine",
        category="WEBSITE WALKTHROUGH • SECTION 01",
        img_name="01_homepage_hero.png",
        side_heading="HERO INTERACTION HIGHLIGHTS",
        bullet_points=[
            "Scrubbable 3D canvas sequence preserved with dual-speed caching and smooth inertial scrolling.",
            "Display of brand coordinates: Transport Nagar, Kota, Rajasthan (Est. 2018).",
            "High-impact gold typography and dynamic audio waveform visualizer.",
            "Instant Call Helpline & Direct WhatsApp action buttons for seamless customer conversion.",
            "Floating Quick-Contact bar for direct mobile consultation."
        ]
    )

    # ─────────────────────────────────────────────────────────────
    # SLIDE 4: Core Sound Systems & Heavy Rigs
    # ─────────────────────────────────────────────────────────────
    add_content_slide(
        title="Core Sound Systems & Heavy Speaker Rigs",
        category="WEBSITE WALKTHROUGH • SECTION 02",
        img_name="02_homepage_sound_systems.png",
        side_heading="SYSTEM CAPABILITIES",
        bullet_points=[
            "18\" Dual Bass System: Engineered for massive SPL output, deep chest-thumping bass, and extreme power handling.",
            "Mid-Top Line Rigs: High-frequency titanium compression drivers for pristine vocal clarity over 500+ meters.",
            "Vehicle & Pickup Sound Setup: Compact, vibration-damped cabinet engineering for all-weather touring.",
            "Direct Factory Inquiry button linked to interactive booking modal."
        ]
    )

    # ─────────────────────────────────────────────────────────────
    # SLIDE 5: Craft Process & 4-Stage Protocol
    # ─────────────────────────────────────────────────────────────
    add_content_slide(
        title="Handcrafted Audio Engineering Protocol",
        category="WEBSITE WALKTHROUGH • SECTION 03",
        img_name="03_homepage_craft_process.png",
        side_heading="MANUFACTURING STAGES",
        bullet_points=[
            "Stage 1: Precision High-Power Circuit Architecture & Class-A topological layout.",
            "Stage 2: Marine Birch Cabinet Joinery with heavy internal acoustic bracing.",
            "Stage 3: Full-Volume Torture & Stress Testing: 100% benchmarked for hours before delivery.",
            "Stage 4: Nationwide Secured Wooden-Crate Logistics & Dispatch from Kota, Rajasthan."
        ]
    )

    # ─────────────────────────────────────────────────────────────
    # SLIDE 6: About Us — Welcome Story & Heritage
    # ─────────────────────────────────────────────────────────────
    add_content_slide(
        title="About Us — Radhe Radios Welcome Story",
        category="ABOUT US PAGE • SECTION 01",
        img_name="05_about_welcome_hero.png",
        side_heading="OFFICIAL BRAND SCRIPT",
        bullet_points=[
            "Established in 2018 in Kota, Rajasthan, Radhe Radios has been a trusted name in high-performance vehicle audio.",
            "Specializing in crafting custom, heavy-duty power amplifiers and professional-grade speakers.",
            "Engineered to deliver a premium, thunderous sound experience on every journey.",
            "Luxury dark aesthetic with champagne gold accents and smooth scroll entrance animations."
        ]
    )

    # ─────────────────────────────────────────────────────────────
    # SLIDE 7: Philosophy — Quality & Value (True Paisa Vasool)
    # ─────────────────────────────────────────────────────────────
    add_content_slide(
        title="Philosophy — Quality & Value (True Paisa Vasool)",
        category="ABOUT US PAGE • SECTION 02",
        img_name="06_about_paisa_vasool_philosophy.png",
        side_heading="CORE VALUES",
        bullet_points=[
            "We believe in true 'paisa vasool'—delivering top-tier audio quality that ensures every single rupee spent is completely worth it.",
            "Products are engineered not just to sound extraordinary, but to last for years.",
            "Unmatched road durability and continuous high-temperature reliability on every journey.",
            "100% Value Guarantee with zero-compromise heavy-duty electronic components."
        ]
    )

    # ─────────────────────────────────────────────────────────────
    # SLIDE 8: Proudly Made in India — Advanced Power Amplifiers
    # ─────────────────────────────────────────────────────────────
    add_content_slide(
        title="Proudly Made in India: Advanced Power Amplifiers",
        category="FEATURE SPOTLIGHT • SECTION 03",
        img_name="07_about_made_in_india_amplifiers.png",
        side_heading="ENGINEERING HIGHLIGHTS",
        bullet_points=[
            "Proudly Made in India: Precision engineering matching global audio performance standards.",
            "Robust Heatsinks: Dissipates extreme thermal loads during continuous all-night operations.",
            "Premium-Grade Capacitors: Clean ripple-free power rails for instant dynamic bass transients.",
            "Class-A Architecture: Ultra-clean sound with minimal harmonic distortion even at maximum gain.",
            "Authentic Indian manufacturing built for massive bass and absolute road reliability."
        ]
    )

    # ─────────────────────────────────────────────────────────────
    # SLIDE 9: Why Choose Us — 3 Pillars of Excellence
    # ─────────────────────────────────────────────────────────────
    add_content_slide(
        title="Why Choose Us? — 3 Pillars of Excellence",
        category="THE RADHE RADIOS ADVANTAGE • SECTION 04",
        img_name="08_about_why_choose_us_pillars.png",
        side_heading="THE 3 PILLARS",
        bullet_points=[
            "1. Premium Sound Engineering: Custom-built amplifiers and speakers designed for crystal-clear acoustics and massive bass output.",
            "2. Built to Last: Rugged durability that stands the test of time, giving you years of uninterrupted, reliable performance.",
            "3. Customer First: Complete satisfaction guaranteed with products tailored to your exact sound preferences.",
            "Engineered Standard benchmarked for stage, vehicle, and commercial installations."
        ]
    )

    # ─────────────────────────────────────────────────────────────
    # SLIDE 10: Products & Audio Catalog
    # ─────────────────────────────────────────────────────────────
    add_content_slide(
        title="Products & Sound Rig Catalogue",
        category="WEBSITE WALKTHROUGH • SECTION 05",
        img_name="10_products_catalog.png",
        side_heading="CATALOGUE CAPABILITIES",
        bullet_points=[
            "Live interactive product filters: Heavy DJ Rigs, Vehicle Amplifiers, Horn Tweeters, Dual Bass Cabinets.",
            "Complete technical spec sheets with RMS power ratings, impedance loads, and cabinet dimensions.",
            "One-click Price List / Spec Sheet download linked to customer login desk.",
            "Direct inquiry button for each custom speaker model."
        ]
    )

    # ─────────────────────────────────────────────────────────────
    # SLIDE 11: Services & Custom Vehicle Audio Setup
    # ─────────────────────────────────────────────────────────────
    add_content_slide(
        title="Services & Custom Vehicle Installations",
        category="WEBSITE WALKTHROUGH • SECTION 06",
        img_name="11_services_custom_audio.png",
        side_heading="OFFERED SERVICES",
        bullet_points=[
            "Custom Vehicle Audio Solutions: Heavy amplifiers & speaker enclosures custom-fabricated for pickup trucks and SUVs.",
            "Professional Event & DJ Systems: High SPL rigs for large weddings, concerts, and cultural processions.",
            "Workshop Acoustic Tuning: Computerized frequency analysis and equalization for zero phase cancellation.",
            "All-India Component Supply & Spare Parts dispatch."
        ]
    )

    # ─────────────────────────────────────────────────────────────
    # SLIDE 12: Pan-India Dealership & Factory Desk
    # ─────────────────────────────────────────────────────────────
    add_content_slide(
        title="Pan-India Dealership Desk & Direct Contact",
        category="WEBSITE WALKTHROUGH • SECTION 07",
        img_name="12_contact_factory_desk.png",
        side_heading="DIRECT ACCESS CHANNELS",
        bullet_points=[
            "Direct Factory Desk located in Transport Nagar, Kota, Rajasthan.",
            "Helpline 1: +91 98871 58522 (Direct Call / WhatsApp).",
            "Helpline 2: +91 95090 40057 (Direct Consultation).",
            "Interactive Inquiry Dispatch form that stores inquiries in user portal.",
            "Official YouTube & Instagram channels linked for live demo videos."
        ]
    )

    # ─────────────────────────────────────────────────────────────
    # SLIDE 13: Standalone Client Presentation Demo Page
    # ─────────────────────────────────────────────────────────────
    add_content_slide(
        title="Standalone Client Demo Webpage",
        category="CLIENT DEMO ASSET • SECTION 08",
        img_name="13_client_demo_page.png",
        side_heading="DEMO ASSET FEATURES",
        bullet_points=[
            "Self-contained, ultra-luxurious HTML file: demo-radhe-radios.html.",
            "Instant Hindi / English toggle button for client presentation.",
            "Zero server dependencies: opens on any phone, tablet, or PC browser.",
            "Direct click-to-call and click-to-WhatsApp buttons for immediate client conversion.",
            "Permanent offline asset saved in public/ folder ready to share via WhatsApp or Email."
        ]
    )

    # ─────────────────────────────────────────────────────────────
    # SLIDE 14: Thank You & Contact Coordinates
    # ─────────────────────────────────────────────────────────────
    slide_end = prs.slides.add_slide(blank_slide_layout)
    set_slide_bg(slide_end)

    end_frame = slide_end.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(11.733), Inches(5.9)
    )
    end_frame.fill.solid()
    end_frame.fill.fore_color.rgb = COLOR_CARD
    end_frame.line.color.rgb = COLOR_GOLD
    end_frame.line.width = Pt(2)

    tbox_end = slide_end.shapes.add_textbox(Inches(1.2), Inches(1.3), Inches(10.933), Inches(5.0))
    tf_end = tbox_end.text_frame
    tf_end.word_wrap = True

    pe1 = tf_end.paragraphs[0]
    pe1.text = "THANK YOU"
    pe1.alignment = PP_ALIGN.CENTER
    pe1.font.name = "Arial"
    pe1.font.size = Pt(36)
    pe1.font.bold = True
    pe1.font.color.rgb = COLOR_GOLD
    pe1.space_after = Pt(12)

    pe2 = tf_end.add_paragraph()
    pe2.text = "RADHE RADIOS • KOTA, RAJASTHAN"
    pe2.alignment = PP_ALIGN.CENTER
    pe2.font.name = "Arial"
    pe2.font.size = Pt(22)
    pe2.font.bold = True
    pe2.font.color.rgb = COLOR_WHITE
    pe2.space_after = Pt(8)

    pe3 = tf_end.add_paragraph()
    pe3.text = "High-Performance Vehicle & Professional Audio Solutions | Custom Heavy-Duty Power Amplifiers"
    pe3.alignment = PP_ALIGN.CENTER
    pe3.font.name = "Arial"
    pe3.font.size = Pt(13)
    pe3.font.color.rgb = COLOR_GRAY
    pe3.space_after = Pt(28)

    pe4 = tf_end.add_paragraph()
    pe4.text = "WORKSHOP & DEALERSHIP COORDINATES:"
    pe4.alignment = PP_ALIGN.CENTER
    pe4.font.name = "Arial"
    pe4.font.size = Pt(12)
    pe4.font.bold = True
    pe4.font.color.rgb = COLOR_GOLD
    pe4.space_after = Pt(10)

    pe5 = tf_end.add_paragraph()
    pe5.text = "📍 Location: Transport Nagar, Kota, Rajasthan\n📞 Primary Contact: +91 98871 58522\n📞 Alternate Contact: +91 95090 40057\n💬 WhatsApp Support: +91 98871 58522\n🌐 Website: http://localhost:5173/ | Client Demo: demo-radhe-radios.html"
    pe5.alignment = PP_ALIGN.CENTER
    pe5.font.name = "Arial"
    pe5.font.size = Pt(12)
    pe5.font.color.rgb = COLOR_WHITE

    # Save Presentation
    output_path_public = os.path.join("public", "Radhe_Radios_Website_Presentation.pptx")
    prs.save(output_path_public)
    print(f"Presentation saved to: {output_path_public}")

    # Also save a copy at project root for instant access
    output_path_root = "Radhe_Radios_Website_Presentation.pptx"
    prs.save(output_path_root)
    print(f"Presentation copy saved to: {output_path_root}")

if __name__ == "__main__":
    create_presentation()
