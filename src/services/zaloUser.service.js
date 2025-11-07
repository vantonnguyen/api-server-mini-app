const axios = require("axios");
const ZaloUser = require("../models/zaloUser.model");
require("dotenv").config();

const ZALO_APP_SECRET_KEY = process.env.ZALO_APP_SECRET_KEY;
const ZALO_ME_ENDPOINT = "https://graph.zalo.me/v2.0/me"; // For basic info (id, name, picture)
const ZALO_PHONE_INFO_ENDPOINT = "https://graph.zalo.me/v2.0/me/info"; // For phone number

/**
 * Fetches user info from Zalo and saves it to the database.
 * @param {string} accessToken - The user's access token from Zalo.
 * @param {string} [phoneToken] - Optional token from getPhoneNumber().
 * @returns {Promise<{user: object, needsPhonePermission: boolean}>}
 */
const getUserInfoAndSave = async (accessToken, phoneToken) => {
  try {
    // Step 1: Always get basic user info from the correct endpoint
    const { data: basicInfoResponse } = await axios.get(ZALO_ME_ENDPOINT, {
      params: {
        access_token: accessToken,
        fields: "id,name,picture", // Explicitly request the fields we need
      },
    });

    if (basicInfoResponse.error) {
      throw new Error(`Zalo API Error (Basic Info): ${basicInfoResponse.message} (Code: ${basicInfoResponse.error})`);
    }

    const { id: zaloId, name, picture } = basicInfoResponse;
    if (!zaloId) {
        throw new Error("Could not retrieve Zalo User ID. The access token might be invalid or lack 'scope.userInfo' permission.");
    }

    let user = await ZaloUser.findByZaloId(zaloId);
    let phoneNumber = user ? user.phone_number : null;

    // If user exists, has a phone number, and we weren't asked to get a new one, we're done.
    if (user && phoneNumber && !phoneToken) {
      return { user, needsPhonePermission: false };
    }

    // Step 2: If a phoneToken is provided, get the phone number from its specific endpoint
    if (phoneToken) {
        const { data: phoneResponse } = await axios.get(ZALO_PHONE_INFO_ENDPOINT, {
            headers: {
                access_token: accessToken,
                code: phoneToken,
                secret_key: ZALO_APP_SECRET_KEY,
            },
        });

        if (phoneResponse.error !== 0) {
            throw new Error(`Zalo API Error (Phone Info): ${phoneResponse.message} (Code: ${phoneResponse.error})`);
        }
        phoneNumber = phoneResponse.data.number;
    }

    // Step 3: Create or Update user in DB with all collected info
    const userData = {
      zalo_id: zaloId,
      name: name,
      phone_number: phoneNumber,
      avatar_url: picture?.data?.url || null,
    };

    if (!user) {
      user = await ZaloUser.create(userData);
    } else {
      // Only update if we have new phone number data
      if (phoneToken && phoneNumber) {
          user = await ZaloUser.update(user.id, userData);
      }
    }

    // Step 4: Final check to see if we still need phone permission
    const needsPhonePermission = !user.phone_number;

    return { user, needsPhonePermission };

  } catch (error) {
    console.error("Error in getUserInfoAndSave service:", error.message);
    if (error.response) {
      console.error("Zalo API Response Data:", error.response.data);
    }
    throw error;
  }
};

module.exports = {
  getUserInfoAndSave,
};
