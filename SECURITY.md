# Security Policy

The project maintainers take the security of our software seriously. We appreciate your efforts to responsibly disclose your findings, and we will make every effort to acknowledge your contributions.

## 🛡️ Supported Versions

We are committed to providing security updates for the versions listed below. If you are using an unsupported version, please upgrade to a supported version.

| Version | Supported          |
| :------ | :----------------- |
| `1.x.x` | :white_check_mark: |
| `< 1.0` | :x:                |

---

## 🔍 Scope

This policy applies to vulnerabilities found in the following areas:
* The main project repository.
* The official documentation website (e.g., `docs.example.com`).
* *(Add any other key assets, like a hosted API, etc.)*

---

## 🚫 Out-of-Scope

The following are generally **not** considered vulnerabilities and will likely be closed as "out-of-scope":

* Attacks requiring physical access to a user's device.
* Social engineering or phishing attacks.
* Reports on outdated software versions without a clear exploit.
* Missing "best practice" security headers (e.g., `X-Frame-Options`, CSP) without a demonstrated exploit.
* Verbose server banners or error messages (unless they leak sensitive information).
* Self-XSS (vulnerabilities that require a user to paste code into their own browser).

---

##  Vulnerability Reporting

If you believe you have found a security vulnerability in this project, **please do not create a public GitHub issue**. Instead, we ask you to report it privately to ensure the security of our users.

Please follow these steps:

1.  **📧 Email Us:** Send a detailed report to our private security alias: **`security@your-project.com`** (<- *REPLACE THIS*).
    * *(Optional: You can also provide a link to a PGP key here for encrypted communication.)*

2.  **Provide Detailed Information:** To help us resolve the issue quickly, please include the following in your report:
    * A clear and descriptive title.
    * The component and version(s) affected.
    * A detailed description of the vulnerability.
    * **Steps to reproduce:** Provide a clear, step-by-step guide. Include any necessary code snippets, screenshots, or proof-of-concept exploits.
    * The potential impact of the vulnerability.

3.  **Confidentiality:** Please treat the vulnerability report as confidential. Do not disclose the issue publicly until we have had a chance to address it and release a patch.

---

## Our Commitment

When you report a vulnerability to us, we promise the following:

* **Acknowledgement:** We will acknowledge receipt of your report within **48 hours**.
* **Communication:** We will provide you with a status update at least once every **7 days**.
* **Resolution:** We will work diligently to investigate and fix the vulnerability. Once resolved, we will notify you.
* **Recognition:** We believe in recognizing the work of security researchers. If you agree, we will be happy to credit you in our release notes once the vulnerability has been patched.

---

## ⚖️ Safe Harbor

We consider security research and vulnerability disclosure activities conducted in accordance with this policy to be "authorized." We will not initiate legal action against you for research activities that are:

* Conducted in good faith.
* Limited to in-scope systems.
* Avoid privacy violations, data destruction, or service interruptions.

We want you to feel comfortable coming to us with your findings.

---

## 💰 Bug Bounties / Compensation

We **do not** offer monetary rewards or bug bounties for vulnerability reports at this time. We are happy to provide public credit and acknowledgement (swag, if available) as a thank you for your contribution to a safer open-source ecosystem.
