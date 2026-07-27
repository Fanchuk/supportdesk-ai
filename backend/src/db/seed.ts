import { db } from './index'
import { users, tickets, messages, teams, assignmentRules, automationRules, slaPolicies, customStatuses } from './schema'
import bcrypt from 'bcryptjs'
import { sql } from 'drizzle-orm'

async function seed() {
    await db.execute(sql`TRUNCATE TABLE messages, tickets, users, assignment_rules, automation_rules, teams, sla_policies, custom_statuses RESTART IDENTITY CASCADE`)

    const [supportTeam, engineeringTeam, financeTeam, productTeam] = await db
        .insert(teams)
        .values([
            { name: 'Support Team', description: 'Handles customer issues' },
            { name: 'Engineering Team', description: 'Technical problems' },
            { name: 'Finance Team', description: 'Billing issues' },
            { name: 'Product Team', description: 'Feature requests' },
        ])
        .returning()

    const hashedPassword = await bcrypt.hash('123456', 10)

    const [admin] = await db
        .insert(users)
        .values({
            name: 'Admin User',
            email: 'admin@desk.com',
            password: hashedPassword,
            role: 'admin',
        })
        .returning()

    const [manager] = await db
        .insert(users)
        .values({
            name: 'Sarah Manager',
            email: 'sarah@desk.com',
            password: hashedPassword,
            role: 'manager',
            teamId: supportTeam.id,
        })
        .returning()

    const [agent1] = await db
        .insert(users)
        .values({
            name: 'John Agent',
            email: 'john@desk.com',
            password: hashedPassword,
            role: 'agent',
            teamId: supportTeam.id,
        })
        .returning()

    const [agent2] = await db
        .insert(users)
        .values({
            name: 'Maria Agent',
            email: 'maria@desk.com',
            password: hashedPassword,
            role: 'agent',
            teamId: engineeringTeam.id,
        })
        .returning()

    const ticketsData = [
        {
            title: 'PC not turning on',
            description: 'My PC wont turn on since this morning',
            status: 'open' as const,
            priority: 'high' as const,
            category: 'Technical',
            createdById: admin.id,
            teamId: supportTeam.id,
            createdAt: new Date('2026-07-12T10:00:00'),
            updatedAt: new Date('2026-07-13T12:30:00'),
        },
        {
            title: 'Payment failed after checkout',
            description: 'I tried to pay but got gateway error',
            status: 'open' as const,
            priority: 'high' as const,
            category: 'Billing',
            createdById: agent1.id,
            teamId: financeTeam.id,
            createdAt: new Date('2026-07-13T11:15:00'),
            updatedAt: new Date('2026-07-14T15:45:00'),
        },
        {
            title: 'Cannot reset password',
            description: 'Email with reset link not arriving',
            status: 'in_progress' as const,
            priority: 'medium' as const,
            category: 'Login',
            createdById: agent2.id,
            teamId: supportTeam.id,
            createdAt: new Date('2026-07-14T09:20:00'),
            updatedAt: new Date('2026-07-15T10:00:00'),
        },
        {
            title: 'Export to CSV wrong date',
            description: 'CSV export shows wrong date format',
            status: 'open' as const,
            priority: 'low' as const,
            category: 'General',
            createdById: manager.id,
            teamId: engineeringTeam.id,
            createdAt: new Date('2026-07-15T14:00:00'),
            updatedAt: new Date('2026-07-16T16:30:00'),
        },
        {
            title: 'Feature request dark mode',
            description: 'Would love dark mode in mobile app',
            status: 'closed' as const,
            priority: 'low' as const,
            category: 'General',
            createdById: agent1.id,
            teamId: productTeam.id,
            createdAt: new Date('2026-07-17T08:30:00'),
            updatedAt: new Date('2026-07-18T11:20:00'),
        },
        {
            title: 'API error 500 on login',
            description: 'Getting 500 error when trying to login via API',
            status: 'in_progress' as const,
            priority: 'high' as const,
            category: 'Technical',
            createdById: admin.id,
            teamId: engineeringTeam.id,
            createdAt: new Date('2026-07-19T13:45:00'),
            updatedAt: new Date('2026-07-20T17:10:00'),
        },
        {
            title: 'Invoice not received',
            description: 'I paid but did not receive invoice by email',
            status: 'open' as const,
            priority: 'medium' as const,
            category: 'Billing',
            createdById: agent2.id,
            teamId: financeTeam.id,
            createdAt: new Date('2026-07-21T10:10:00'),
            updatedAt: new Date('2026-07-22T14:00:00'),
        },
        {
            title: 'App crashes on startup',
            description: 'Mobile app crashes immediately after opening',
            status: 'open' as const,
            priority: 'high' as const,
            category: 'Technical',
            createdById: agent1.id,
            teamId: engineeringTeam.id,
            createdAt: new Date('2026-07-23T16:20:00'),
            updatedAt: new Date('2026-07-24T09:15:00'),
        },
        {
            title: 'Login page broken',
            description: 'Cannot login on mobile',
            status: 'open' as const,
            priority: 'high' as const,
            category: 'Technical',
            createdById: admin.id,
            teamId: engineeringTeam.id,
            createdAt: new Date('2026-07-11'),
            updatedAt: new Date('2026-07-12'),
        },
        {
            title: 'Billing address wrong',
            description: 'My billing address is incorrect',
            status: 'open' as const,
            priority: 'medium' as const,
            category: 'Billing',
            createdById: agent1.id,
            teamId: financeTeam.id,
            createdAt: new Date('2026-07-10'),
            updatedAt: new Date('2026-07-11'),
        },
        {
            title: 'Dark mode issue',
            description: 'Dark mode breaks layout',
            status: 'in_progress' as const,
            priority: 'low' as const,
            category: 'Technical',
            createdById: agent2.id,
            teamId: engineeringTeam.id,
            createdAt: new Date('2026-07-09'),
            updatedAt: new Date('2026-07-10'),
        },
        {
            title: 'Password change not working',
            description: 'Cannot change password',
            status: 'closed' as const,
            priority: 'medium' as const,
            category: 'Login',
            createdById: manager.id,
            teamId: supportTeam.id,
            createdAt: new Date('2026-07-08'),
            updatedAt: new Date('2026-07-09'),
        },
        {
            title: 'Export PDF broken',
            description: 'PDF export returns error',
            status: 'open' as const,
            priority: 'high' as const,
            category: 'Technical',
            createdById: admin.id,
            teamId: engineeringTeam.id,
            createdAt: new Date('2026-07-07'),
            updatedAt: new Date('2026-07-08'),
        },
        {
            title: 'Subscription renewal failed',
            description: 'Auto-renewal did not work',
            status: 'open' as const,
            priority: 'high' as const,
            category: 'Billing',
            createdById: agent1.id,
            teamId: financeTeam.id,
            createdAt: new Date('2026-07-06'),
            updatedAt: new Date('2026-07-07'),
        },
        {
            title: 'Notification not sending',
            description: 'Push notifications stopped',
            status: 'in_progress' as const,
            priority: 'medium' as const,
            category: 'Technical',
            createdById: agent2.id,
            teamId: engineeringTeam.id,
            createdAt: new Date('2026-07-05'),
            updatedAt: new Date('2026-07-06'),
        },
        {
            title: 'Account locked out',
            description: 'Too many failed login attempts',
            status: 'open' as const,
            priority: 'high' as const,
            category: 'Login',
            createdById: manager.id,
            teamId: supportTeam.id,
            createdAt: new Date('2026-07-04'),
            updatedAt: new Date('2026-07-05'),
        },
        {
            title: 'Search not working',
            description: 'Search returns no results',
            status: 'closed' as const,
            priority: 'low' as const,
            category: 'Technical',
            createdById: admin.id,
            teamId: engineeringTeam.id,
            createdAt: new Date('2026-07-03'),
            updatedAt: new Date('2026-07-04'),
        },
        {
            title: 'Wrong currency displayed',
            description: 'Price shown in wrong currency',
            status: 'open' as const,
            priority: 'medium' as const,
            category: 'Billing',
            createdById: agent1.id,
            teamId: financeTeam.id,
            createdAt: new Date('2026-07-02'),
            updatedAt: new Date('2026-07-03'),
        },
    ]

    const createdTickets = await db.insert(tickets).values(ticketsData).returning()

    await db.insert(messages).values([
        { body: 'My PC wont turn on since this morning, tried everything', ticketId: createdTickets[0].id, authorId: admin.id },
        { body: 'Did you check the power cable?', ticketId: createdTickets[0].id, authorId: agent1.id },
        { body: 'Yes still not working, no lights at all', ticketId: createdTickets[0].id, authorId: admin.id },
        { body: 'Payment failed with gateway timeout error', ticketId: createdTickets[1].id, authorId: agent1.id },
        { body: 'Sorry for the issue. Can you share your order number?', ticketId: createdTickets[1].id, authorId: agent2.id },
        { body: 'Reset email not arriving even after 30 minutes', ticketId: createdTickets[2].id, authorId: agent2.id },
        { body: 'Please check your spam folder', ticketId: createdTickets[2].id, authorId: agent1.id },
        { body: 'Not in spam either', ticketId: createdTickets[2].id, authorId: agent2.id },
    ])

    await db.insert(assignmentRules).values([
        { name: 'Billing Issue → Finance Team', keywords: ['billing', 'invoice', 'payment'], teamId: financeTeam.id, isActive: true },
        { name: 'Technical Support → Engineering', keywords: ['error', 'bug', 'crash', 'api'], teamId: engineeringTeam.id, isActive: true },
        { name: 'Feature Requests → Product Team', keywords: ['feature', 'suggestion', 'enhancement'], teamId: productTeam.id, isActive: true },
    ])

    await db.insert(automationRules).values([
        {
            name: 'Auto-Close Resolved Tickets',
            description: 'Automatically close tickets resolved for 7 days',
            trigger: 'time_based',
            action: 'close_ticket',
            conditionHours: 168,
            isActive: true,
            executedCount: 234,
        },
        {
            name: 'Welcome Email for New Tickets',
            description: 'Send automated welcome email when a new ticket is created',
            trigger: 'new_ticket',
            action: 'send_email',
            isActive: true,
            executedCount: 2134,
        },
        {
            name: 'Priority Escalation',
            description: 'Escalate ticket priority if no response within 4 hours',
            trigger: 'time_based',
            action: 'change_priority',
            conditionHours: 4,
            isActive: true,
            executedCount: 432,
        },
    ])

    await db.insert(customStatuses).values([
        { label: 'Waiting for Customer', color: '#f59e0b', description: 'Awaiting reply from the customer', isActive: true },
        { label: 'On Hold', color: '#6b7280', description: 'Ticket is paused pending external action', isActive: true },
        { label: 'Escalated', color: '#ef4444', description: 'Ticket has been escalated to senior support', isActive: true },
        { label: 'Pending Review', color: '#6366f1', description: 'Waiting for internal review before closing', isActive: false },
    ])

    await db.insert(slaPolicies).values([
        { name: 'Critical Support', priority: 'high', firstResponseHours: 1, resolutionHours: 4, isActive: true },
        { name: 'Standard Support', priority: 'medium', firstResponseHours: 4, resolutionHours: 24, isActive: true },
        { name: 'Low Priority Support', priority: 'low', firstResponseHours: 8, resolutionHours: 72, isActive: false },
    ])

    process.exit(0)
}

seed().catch((err) => {
    console.error(err)
    process.exit(1)
})
