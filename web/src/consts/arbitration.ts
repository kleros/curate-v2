export const KLEROS_ARBITRATOR = "0xA54e7A16d7460e38a8F324eF46782FB520d58CE8";
export const KLEROS_GOVERNOR = "0xf1C7c037891525E360C59f708739Ac09A7670c59";
export const EVIDENCE_MODULE = "0x57fd453FB0d16f8ca174E7386102D7170E17Be09";
export const TEMPLATE_REGISTRY = "0x596D3B09E684D62217682216e9b7a0De75933391";

export const registrationTemplate = `{
    "$schema": "../NewDisputeTemplate.schema.json",
    "title": "Let's do this",
    "description": "We want to do this: %s",
    "question": "Does it comply with the policy?",
    "answers": [
      {
        "title": "Yes",
        "description": "Select this if you agree that it must be done."
      },
      {
        "title": "No",
        "description": "Select this if you do not agree that it must be done."
      }
    ],
    "policyURI": "/ipfs/Qmdvk...rSD6cE/policy.pdf",
    "frontendUrl": "https://kleros-v2.netlify.app/#/cases/%s/overview",
    "arbitratorChainID": "421614",
    "arbitratorAddress": "0xD08Ab99480d02bf9C092828043f611BcDFEA917b",
    "category": "Others",
    "specification": "KIP001",
    "lang": "en_US"
  }
  `;

export const removalTemplate = `{
    "$schema": "../NewDisputeTemplate.schema.json",
    "title": "Let's do this",
    "description": "We want to do this: %s",
    "question": "Should this be removed?",
    "answers": [
      {
        "title": "Yes",
        "description": "Select this if you agree that it must be done."
      },
      {
        "title": "No",
        "description": "Select this if you do not agree that it must be done."
      }
    ],
    "policyURI": "/ipfs/Qmdvk...rSD6cE/policy.pdf",
    "frontendUrl": "https://kleros-v2.netlify.app/#/cases/%s/overview",
    "arbitratorChainID": "421614",
    "arbitratorAddress": "0xD08Ab99480d02bf9C092828043f611BcDFEA917b",
    "category": "Others",
    "specification": "KIP001",
    "lang": "en_US"
  }
  `;
