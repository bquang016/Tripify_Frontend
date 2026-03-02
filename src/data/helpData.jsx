// src/data/helpData.js
import { BookOpen, CreditCard, User, Home } from 'lucide-react';

export const getHelpData = (t) => {
    const categories = [
        {
            id: 'booking',
            name: t('support.categories.booking'),
            icon: BookOpen,
            desc: t('support.category_desc.booking', 'Booking guide, cancellation & schedule changes')
        },
        {
            id: 'payment',
            name: t('support.categories.payment'),
            icon: CreditCard,
            desc: t('support.category_desc.payment', 'Payment methods, refunds & invoicing')
        },
        {
            id: 'account',
            name: t('support.categories.account'),
            icon: User,
            desc: t('support.category_desc.account', 'Profile management, security & password recovery')
        },
        {
            id: 'partner',
            name: t('common.partner_with_us'),
            icon: Home,
            desc: t('support.category_desc.partner', 'Rent registration, property management & revenue')
        },
    ];

    const faqs = [
        {
            id: 1,
            category: 'booking',
            question: t('faq.q1', 'How do I know my booking was successful?'),
            answer: t('faq.a1', 'After completing payment, you will receive a confirmation email. The status in "My Bookings" will change to "Confirmed".')
        },
        {
            id: 2,
            category: 'booking',
            question: t('faq.q2', 'How is the cancellation and refund policy calculated?'),
            answer: t('faq.a2', 'It depends on the hotel/host policy. Common levels: Free cancellation 24h/48h before, or 50-100% fee of the first night.')
        },
        {
            id: 5,
            category: 'payment',
            question: t('faq.q5', 'What payment methods are supported?'),
            answer: t('faq.a5', 'We support Visa, Mastercard, JCB, VNPay, MoMo, and Bank Transfer via QR Code.')
        },
        {
            id: 8,
            category: 'account',
            question: t('faq.q8', 'How to recover my password if forgotten?'),
            answer: t('faq.a8', 'Click "Forgot Password" on the Login screen. Enter your email to receive a password reset link valid for 15 minutes.')
        }
    ];

    return { categories, faqs };
};
