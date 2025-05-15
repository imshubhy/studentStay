export default function Footer() {
  return (
     // Use a subtle background color from the theme, ensure contrast
    <footer className="border-t border-border/50 py-8 bg-background">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} StudentStay. All rights reserved.</p>
        <p className="mt-1">Find your perfect student stay.</p>
      </div>
    </footer>
  );
}
