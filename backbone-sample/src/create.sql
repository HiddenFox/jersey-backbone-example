USE [RegisterDemo];
CREATE TABLE [dbo].[rd_user](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[username] [varchar](50) NOT NULL,
	[password] [varchar](50) NOT NULL,
	[email] [varchar](50) NOT NULL,
	[phone] [varchar](50) NULL
) ON [PRIMARY];