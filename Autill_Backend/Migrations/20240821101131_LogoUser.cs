using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Autill.Migrations
{
    /// <inheritdoc />
    public partial class LogoUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Logo",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Logo",
                table: "AspNetUsers");
        }
    }
}
