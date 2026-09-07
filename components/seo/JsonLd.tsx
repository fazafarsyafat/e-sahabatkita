export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'NGO'],
        '@id': 'https://www.pmiikabbandung.org/#organization',
        name: 'PMII Kab Bandung',
        alternateName: [
          'PMII Kabupaten Bandung',
          'PC PMII Kab Bandung',
          'PC PMII Kabupaten Bandung',
          'Pergerakan Mahasiswa Islam Indonesia Kabupaten Bandung',
          'Pengurus Cabang PMII Kabupaten Bandung',
          'E-Sahabat PMII Kabupaten Bandung',
        ],
        url: 'https://www.pmiikabbandung.org',
        logo: {
          '@type': 'ImageObject',
          '@id': 'https://www.pmiikabbandung.org/#logo',
          url: 'https://www.pmiikabbandung.org/logo-wide.png',
          caption: 'Logo PMII Kab Bandung',
        },
        image: 'https://www.pmiikabbandung.org/logo-wide.png',
        description:
          'Website resmi Pengurus Cabang Pergerakan Mahasiswa Islam Indonesia (PC PMII) Kabupaten Bandung. Pusat kaderisasi mahasiswa, pergerakan, dan layanan administrasi digital anggota PMII se-Kabupaten Bandung.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Sekretariat PC PMII Kab. Bandung',
          addressLocality: 'Soreang',
          addressRegion: 'Kabupaten Bandung, Jawa Barat',
          postalCode: '40911',
          addressCountry: 'ID',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+62-812-3456-7890',
          contactType: 'customer service',
          email: 'pcpmiikabupatenbandung@gmail.com',
          availableLanguage: ['Indonesian'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.pmiikabbandung.org/#website',
        url: 'https://www.pmiikabbandung.org',
        name: 'PMII Kab Bandung',
        alternateName: [
          'Website Resmi PMII Kabupaten Bandung',
          'PC PMII Kab Bandung',
          'PC PMII Kabupaten Bandung',
          'E-SAHABAT PMII Kab Bandung',
        ],
        description:
          'Portal resmi PC PMII Kabupaten Bandung dan Sistem Informasi Administrasi Digital E-SAHABAT.',
        publisher: {
          '@id': 'https://www.pmiikabbandung.org/#organization',
        },
        inLanguage: 'id-ID',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
