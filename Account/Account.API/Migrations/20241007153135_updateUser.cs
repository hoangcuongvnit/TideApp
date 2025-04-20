using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Account.API.Migrations
{
    /// <inheritdoc />
    public partial class updateUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_WebApplication_ApplicationId",
                table: "Users");

            migrationBuilder.AlterColumn<Guid>(
                name: "ApplicationId",
                table: "Users",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_WebApplication_ApplicationId",
                table: "Users",
                column: "ApplicationId",
                principalTable: "WebApplication",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_WebApplication_ApplicationId",
                table: "Users");

            migrationBuilder.AlterColumn<Guid>(
                name: "ApplicationId",
                table: "Users",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_WebApplication_ApplicationId",
                table: "Users",
                column: "ApplicationId",
                principalTable: "WebApplication",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
