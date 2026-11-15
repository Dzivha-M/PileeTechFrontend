<?php
$page_title = "Projects";
include 'includes/header.php';
?>

<section class="page-hero hero-projects">
    <div class="container">
        <h1>Projects & Strategic Deployments</h1>
        <p>Explore our upcoming technology and logistics divisions alongside strategic pilot deployments.</p>
    </div>
</section>

<section class="service-block alt-bg" id="upcoming">
    <div class="container">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 8px;">
            <h2 style="margin: 0;">Upcoming Projects: Technology Solutions</h2>
            <span class="status">IN DEVELOPMENT / PILOT DEPLOYMENTS</span>
        </div>
        <p class="section-intro">Currently undergoing pilot testing across enterprise clients before full public rollout.</p>

        <div class="booking-grid">
            <div class="booking-card">
                <img src="assets/cloud-office.jpg" alt="Cloud Migration Pilot" class="service-thumb" onerror="this.src='assets/logo.jpeg'">
                <div class="booking-card-body">
                    <span style="font-size: 11px; font-weight: 700; color: var(--blue-dark); text-transform: uppercase;">Cloud Infrastructure</span>
                    <h3>Corporate Cloud & Microsoft 365 Migration</h3>
                    <p class="service-desc">Multi-site tenant migration moving local file storage and mailboxes to Exchange and SharePoint with MFA enforcement.</p>
                    <div style="margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border);">
                        <span style="font-size: 12px; font-weight: 700; color: #16834B;">Phase: Active Pilot Deployment</span>
                    </div>
                </div>
            </div>

            <div class="booking-card">
                <img src="assets/network-cabling.jpg" alt="Campus Structured Cabling" class="service-thumb" onerror="this.src='assets/logo.jpeg'">
                <div class="booking-card-body">
                    <span style="font-size: 11px; font-weight: 700; color: var(--blue-dark); text-transform: uppercase;">Networking</span>
                    <h3>Campus Structured Cabling & Managed Wi-Fi</h3>
                    <p class="service-desc">Complete Cat6 cabling drops, patch panel rack refreshes, and enterprise access point deployment for zero VOIP latency.</p>
                    <div style="margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border);">
                        <span style="font-size: 12px; font-weight: 700; color: #16834B;">Phase: Network Testing & Audit</span>
                    </div>
                </div>
            </div>

            <div class="booking-card">
                <img src="assets/desktop-support.jpg" alt="Managed Helpdesk System" class="service-thumb" onerror="this.src='assets/logo.jpeg'">
                <div class="booking-card-body">
                    <span style="font-size: 11px; font-weight: 700; color: var(--blue-dark); text-transform: uppercase;">Digital Systems</span>
                    <h3>Automated Admin & Ticketing Helpdesk</h3>
                    <p class="service-desc">Digital approval workflows, remote hardware diagnostics, and automated POPIA compliance pipelines.</p>
                    <div style="margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border);">
                        <span style="font-size: 12px; font-weight: 700; color: #16834B;">Phase: Architecture & Trial</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="service-block">
    <div class="container">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 8px;">
            <h2 style="margin: 0;">Upcoming Projects: Logistics & Fleet Transport</h2>
            <span class="status">FUTURE EXPANSION ROADMAP</span>
        </div>
        <p class="section-intro">Transport networks, freight distribution, and commercial removals scheduled for operational scaling.</p>

        <div class="booking-grid">
            <div class="booking-card">
                <img src="assets/freight-transport.jpg" alt="Regional Transport" class="service-thumb" onerror="this.src='assets/logo.jpeg'">
                <div class="booking-card-body">
                    <span style="font-size: 11px; font-weight: 700; color: var(--blue-dark); text-transform: uppercase;">Freight Logistics</span>
                    <h3>Scheduled Gauteng B2B Retail Distribution</h3>
                    <p class="service-desc">Coordinating scheduled freight delivery runs between regional hubs and local commercial distribution centers.</p>
                    <div style="margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border);">
                        <span style="font-size: 12px; font-weight: 700; color: #16834B;">Phase: Route Optimization</span>
                    </div>
                </div>
            </div>

            <div class="booking-card">
                <img src="assets/office-moving.jpg" alt="Office Relocation" class="service-thumb" onerror="this.src='assets/logo.jpeg'">
                <div class="booking-card-body">
                    <span style="font-size: 11px; font-weight: 700; color: var(--blue-dark); text-transform: uppercase;">Commercial Moving</span>
                    <h3>Corporate Office Relocation Operations</h3>
                    <p class="service-desc">End-to-end relocation protocols for workstations, IT equipment, server racks, and archives over weekend turnarounds.</p>
                    <div style="margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border);">
                        <span style="font-size: 12px; font-weight: 700; color: #16834B;">Phase: Fleet Allocation</span>
                    </div>
                </div>
            </div>

            <div class="booking-card">
                <img src="assets/courier-delivery.jpg" alt="Dedicated Fleet Operations" class="service-thumb" onerror="this.src='assets/logo.jpeg'">
                <div class="booking-card-body">
                    <span style="font-size: 11px; font-weight: 700; color: var(--blue-dark); text-transform: uppercase;">Fleet Management</span>
                    <h3>Specialized B2B Fleet Dispatch & Courier</h3>
                    <p class="service-desc">Contract drivers, real-time GPS delivery tracking, and rapid parcel transport for sensitive commercial inventory.</p>
                    <div style="margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border);">
                        <span style="font-size: 12px; font-weight: 700; color: #16834B;">Phase: GPS Tracking Testing</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="cta-strip">
    <div class="container">
        <h2>Have a custom project or contract inquiry?</h2>
        <p>Contact our operations team to discuss schedules, service estimates, or project scopes.</p>
        <a href="contact.php" class="btn btn-primary">Get in Touch</a>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
