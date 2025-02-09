import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

const ios = Platform.OS == 'ios';

export default function CustomKeyboardView({ children, inChat }) {
    let kavConfig = {};
    if (inChat) {
        kavConfig = { keyboardVerticalOffset: 90 };
    }
    return (
        <KeyboardAvoidingView
            behavior={ios ? 'padding' : 'height'}
            style={{ flex: 1 }}
            {...kavConfig}
        >
            {
                children
            }
        </KeyboardAvoidingView >
    )
}