// Simple LinkedIn post script using UGC Posts API
// Requires env: LINKEDIN_ACCESS_TOKEN, LINKEDIN_PERSON_URN, POST_MESSAGE, POST_URL

const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
const personUrn = process.env.LINKEDIN_PERSON_URN; // e.g., urn:li:person:XXXXXXXX
const message = process.env.POST_MESSAGE || '';
const shareUrl = process.env.POST_URL || '';

if (!accessToken || !personUrn) {
  console.error('Missing LINKEDIN_ACCESS_TOKEN or LINKEDIN_PERSON_URN.');
  process.exit(1);
}

if (!message) {
  console.error('Missing POST_MESSAGE input.');
  process.exit(1);
}

// Compose UGC post payload (public visibility)
const payload = {
  author: personUrn,
  lifecycleState: 'PUBLISHED',
  specificContent: {
    'com.linkedin.ugc.ShareContent': {
      shareCommentary: { text: message },
      shareMediaCategory: shareUrl ? 'ARTICLE' : 'NONE',
      ...(shareUrl
        ? {
            media: [
              {
                status: 'READY',
                originalUrl: shareUrl,
                title: { text: 'Projectile Motion Simulator' },
              },
            ],
          }
        : {}),
    },
  },
  visibility: {
    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
  },
};

async function post() {
  const resp = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const text = await resp.text();
    console.error('LinkedIn API error', resp.status, text);
    process.exit(1);
  }
  console.log('Posted to LinkedIn successfully.');
}

post().catch((e) => {
  console.error(e);
  process.exit(1);
});
