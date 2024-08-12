<template>
    <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card :loading="loadingModal">
            <template slot="progress">
                <v-progress-linear color="yellow darken-2" height="8" indeterminate></v-progress-linear>
            </template>
            <v-card-title><v-icon left>mdi-security</v-icon>
                <span class="text-h5">Change Password</span>
            </v-card-title>
            <v-card-text>
                <p>
                    Enter the new credentials for your account, verify that your new
                    password matches the verification.
                </p>

                <v-row>
                    <v-col cols="12" sm="12" md="12">
                        <v-row>
                            <v-col cols="12" md="12" ms="4">
                                <v-text-field v-model="passwordData.newPassword" :rules="passwordRule"
                                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="showPassword ? 'text' : 'password'" name="New Password" label="New Password"
                                    hint="At least 8 characters" counter filled
                                    @click:append="showPassword = !showPassword"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="12" ms="4">
                                <v-text-field v-model="passwordData.verificationPassword" name="Verification Password"
                                    label="Verification Password" hint="At least 8 characters" counter filled
                                    :append-icon="showVerificationPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="showVerificationPassword ? 'text' : 'password'"
                                    @click:append="showVerificationPassword = !showVerificationPassword"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="
                    (dialog = false) +
                    (passwordData.newPassword = null) +
                    (passwordData.verificationPassword = null)
                    ">
                    Cancel
                </v-btn>
                <v-btn :disabled="!verificationPasswordRule" @click="changePassword" color="primary">
                    Change
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { changePasswordUser, refreshToken } from "../helpers/Auth";
export default {
    data() {
        return {
            valid: false, 
            loadingModal: false,
            dialog: false,
            showPassword: false,
            showVerificationPassword: false,
            passwordData: { newPassword: null, verificationPassword: null },
            passwordRule: [
                (v) =>
                    (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+/.test(
                        v
                    ) &&
                        v.length >= 8) ||
                    "Password must contain lowercase, uppercase, and special characters",
            ],
        };
    },
    computed: {
        userInfo() {
            return this.$store.getters.getUser;
        },
        verificationPasswordRule() {
            if (
                this.passwordData.newPassword &&
                this.passwordData.newPassword === this.passwordData.verificationPassword
            ) {
                return true;
            }
            return false;
        },
    },

    async mounted() { 
    },
    methods: {
        alertProcess(text, method) {
            const data = {
                value: true,
                text,
                method,
            };
            this.$emit('password-event', data);

        },

        convertTimestampToDate(timestamp) {
            if (typeof timestamp === "string") {
                return "-";
            }
            const { seconds, nanoseconds } = timestamp;
            const milliseconds = seconds * 1000;
            const additionalMilliseconds = nanoseconds / 1000000;
            const date = new Date(milliseconds + additionalMilliseconds);
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();

            let hours = date.getHours();
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const second = String(date.getSeconds()).padStart(2, "0");
            const ampm = hours >= 12 ? "pm" : "am";

            hours = hours % 12;
            hours = hours ? hours : 12;
            hours = String(hours).padStart(2, "0");

            return `${day}/${month}/${year} ${hours}:${minutes}:${second} ${ampm}`;
        },

        async changePassword() {
            this.loadingModal = true;
            const { authID, auth } = this.userInfo;
            const { newPassword } = this.passwordData;

            const changeResponse = await changePasswordUser(
                {
                    uid: authID,
                    password: newPassword,
                },
                auth
            );

            if ("message" in changeResponse && changeResponse.message === "403") {
                this.refreshAndSaveToken(auth);
                return;
            }

            if (changeResponse.status !== 200) {
                this.loadingModal = false;
                this.alertProcess(changeResponse, "error");
                return;
            }
            this.loadingModal = false;
            this.alertProcess(changeResponse.body.info, "info");
            return;
        },

        async refreshAndSaveToken(auth) {
            const newTokens = await refreshToken(auth);
            if ("access_token" in newTokens) {
                this.$store.dispatch("fetchUserTokens", newTokens.access_token);
                setTimeout(() => {
                    this.changePassword();
                }, 2000);
            }
        },
    },
};
</script>

<style scoped></style>